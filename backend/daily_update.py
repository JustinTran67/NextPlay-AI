import os
import sys
import django
import pandas as pd
from datetime import datetime
from kaggle.api.kaggle_api_extended import KaggleApi
from huggingface_hub import upload_file, HfApi, login
import math

# Add project directory to sys.path and set Django settings
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.append(BASE_DIR)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from backendApp.models import PlayerGameStat, Player
from ml_models.train_model2 import train_and_save_model

HF_REPO = os.getenv("HF_MODEL_REPO")
MAX_ROWS = int(os.getenv("MAX_ROWS", 15000))

# Kaggle credentials
os.environ['KAGGLE_CONFIG_DIR'] = os.path.expanduser("~/.kaggle")
if not os.getenv("KAGGLE_USERNAME") or not os.getenv("KAGGLE_KEY"):
    raise EnvironmentError("KAGGLE_USERNAME or KAGGLE_KEY environment variable not set.")

# Hugging Face credentials
hf_token = os.getenv("HUGGINGFACE_TOKEN")
if not hf_token:
    raise EnvironmentError("HUGGINGFACE_TOKEN not set in environment.")
login(token=hf_token)

def download_latest_dataset():
    api = KaggleApi()
    api.authenticate()
    dataset = "eoinamoore/historical-nba-data-and-player-box-scores"
    api.dataset_download_files(dataset, path="data/", unzip=True)
    print("Downloaded latest Kaggle dataset")

def parse_float(value):
    if value is None:
        return None
    try:
        f = float(value)
        if math.isnan(f):
            return None
        return f
    except (ValueError, TypeError):
        return None

def parse_minutes(value):
    """Handle MM:SS format (e.g. '23:31'), decimals, ints, and empty strings."""
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return None
    s = str(value).strip()
    if s in ('', 'nan'):
        return None
    if ':' in s:
        parts = s.split(':')
        try:
            return round(float(parts[0]) + float(parts[1]) / 60, 2)
        except (ValueError, IndexError):
            return None
    return parse_float(s)

def clean_dataset(df):
    df['gameDateTimeEst'] = pd.to_datetime(df['gameDateTimeEst'], errors='coerce').dt.date

    for col in ['playerteamCity', 'playerteamName', 'opponentteamCity', 'opponentteamName']:
        df[col] = df[col].fillna('').astype(str).str.strip()
    
    for col in ['gameLabel', 'gameSubLabel', 'gameType']:
        if col in df.columns:
            df[col] = df[col].fillna('').astype(str).str.strip()
    
    df['numMinutes'] = df['numMinutes'].apply(parse_minutes)

    numeric_cols = [
        'win', 'home', 'points', 'assists', 'blocks', 'steals',
        'fieldGoalsAttempted', 'fieldGoalsMade', 'fieldGoalsPercentage',
        'threePointersAttempted', 'threePointersMade', 'threePointersPercentage',
        'freeThrowsAttempted', 'freeThrowsMade', 'freeThrowsPercentage',
        'reboundsDefensive', 'reboundsOffensive', 'reboundsTotal',
        'foulsPersonal', 'turnovers', 'plusMinusPoints',
    ]
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    return df

def update_database():
    new_data = pd.read_csv("data/PlayerStatistics.csv", low_memory=False)
    new_data = clean_dataset(new_data)

    latest_game = PlayerGameStat.objects.order_by('-game_date').first()
    latest_game_date = latest_game.game_date if latest_game else datetime(2025,3,17).date()

    new_rows = new_data[new_data['gameDateTimeEst'] > latest_game_date].copy()
    new_rows.loc[new_rows['playerteamCity'] == 'LA', 'playerteamCity'] = 'Los Angeles'
    new_rows.loc[new_rows['opponentteamCity'] == 'LA', 'opponentteamCity'] = 'Los Angeles'    

    if new_rows.empty:
        print("No new game data found.")
        return False

    objs = []
    for _, row in new_rows.iterrows():
        player_name = row['firstName'].strip() + ' ' + row['lastName'].strip()
        player, _ = Player.objects.get_or_create(name=player_name)

        #trade detection
        current_team = row['playerteamCity'] + ' ' + row['playerteamName']
        if player.team != current_team:
            print(f"[TRADE DETECTED] {player_name} moved from {player.team} to {current_team}")
            player.team = current_team
            player.save()

        objs.append(PlayerGameStat(
            player=player,
            game_date = row['gameDateTimeEst'],
                    game_type = row['gameType'] if row['gameType'] else None,
                    team = row['playerteamCity'] + ' ' + row['playerteamName'],
                    opponent = row['opponentteamCity'] + ' ' + row['opponentteamName'],
                    win = int(row['win']) if pd.notnull(row['win']) else None,
                    home = int(row['home']),
                    minutes = parse_float(row['numMinutes']),
                    points = parse_float(row['points']),
                    assists = parse_float(row['assists']),
                    blocks = parse_float(row['blocks']),
                    steals = parse_float(row['steals']),
                    fg_percent = parse_float(row['fieldGoalsPercentage']),
                    threepa = parse_float(row['threePointersAttempted']),
                    threep = parse_float(row['threePointersMade']),
                    threep_percent = parse_float(row['threePointersPercentage']),
                    fta = parse_float(row['freeThrowsAttempted']),
                    ft = parse_float(row['freeThrowsMade']),
                    ft_percent = parse_float(row['freeThrowsPercentage']),
                    total_rebounds = parse_float(row['reboundsTotal']),
                    personal_fouls = parse_float(row['foulsPersonal']),
                    turnovers = parse_float(row['turnovers']),
        ))

    PlayerGameStat.objects.bulk_create(objs)
    print(f"Inserted {len(objs)} new PlayerGameStat rows")

    total_rows = PlayerGameStat.objects.count()
    if total_rows > MAX_ROWS:
        excess = total_rows - MAX_ROWS
        oldest_objs = PlayerGameStat.objects.order_by('game_date')[:excess]
        PlayerGameStat.objects.filter(pk__in=[o.pk for o in oldest_objs]).delete()
        print(f"Deleted {excess} oldest rows to maintain MAX_ROWS")

    return True

def retrain_and_upload():
    model_path = train_and_save_model()
    model_filename = os.path.basename(model_path)  # "player_multioutput_projection.pkl"
    if not model_path:
        print("Training skipped (no data available).")
        return

    upload_file(
        path_or_fileobj=model_path,
        path_in_repo=model_filename,
        repo_id=HF_REPO,
        repo_type="model",
        commit_message=f"Auto update: retrained on {datetime.now()}",
    )
    print("Uploaded latest model to Hugging Face")

if __name__ == "__main__":
    print("Starting daily update pipeline...")
    download_latest_dataset()
    if update_database():
        retrain_and_upload()
    else:
        print("No new data, skipping retraining.")
    print("Daily update complete.")