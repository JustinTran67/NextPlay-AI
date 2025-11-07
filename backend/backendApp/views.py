from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Player, SeasonStat, PlayerGameStat
from .serializers import PlayerSerializer, SeasonStatSerializer, PlayerGameStatSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly, AllowAny
import joblib
import numpy as np
import pandas as pd
import os
from django.conf import settings
from ml_models.data_preperation import add_recent_average_features

# extras for deployment (Downloading model from HF because too big to push to github)
import io
import requests
from huggingface_hub import hf_hub_download

# parssing for debugging 11/6/25:
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'team', 'position']
    permission_classes = [IsAuthenticatedOrReadOnly]

class SeasonStatViewSet(viewsets.ModelViewSet):
    queryset = SeasonStat.objects.all()
    serializer_class = SeasonStatSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['player__name', 'season', 'team']
    ordering_fields = ['points', 'rebounds', 'assists', 'steals', 'blocks']
    permission_classes = [IsAuthenticatedOrReadOnly]

    #season filter
    def get_queryset(self):
        season = self.request.query_params.get('season')
        if season:
            return SeasonStat.objects.filter(season=season)
        return SeasonStat.objects.all()
    
class PlayerGameStatViewSet(viewsets.ModelViewSet):
    queryset = PlayerGameStat.objects.all()
    serializer_class = PlayerGameStatSerializer
    filter_backends = (filters.SearchFilter, filters.OrderingFilter)
    search_fields = ['player__name', 'team', 'opponent', 'game_date']
    ordering_fields = ['points', 'rebounds', 'assists', 'steals', 'blocks']
    permission_classes = [IsAuthenticatedOrReadOnly]

class PlayerPredictionViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    _model = None

    @classmethod
    def getModel(cls):
        if cls._model is not None:
            return cls._model

        local_model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'player_multioutput_projection.pkl')
        if os.path.exists(local_model_path):
            print(f"Loading local model from {local_model_path}")
            cls._model = joblib.load(local_model_path)
            return cls._model

        repo_id = os.environ.get("HF_MODEL_REPO", "JustinTran67/nbamodel")
        filename = "player_multioutput_projection.pkl"
        try:
            model_path = hf_hub_download(
                repo_id=repo_id,
                filename=filename,
                cache_dir=os.environ.get("MODEL_DOWNLOAD_DIR", "/tmp"),
            )
            cls._model = joblib.load(model_path)
            print(f"Model loaded successfully from Hugging Face: {model_path}")
        except Exception as e:
            print(f"Failed to load model: {e}")
            cls._model = None
        return cls._model

    @action(detail=False, methods=['post'])
    def predict(self, request):
        try:
            print("Incoming prediction request:", request.data)  # debug line
            model = self.getModel()
            if model is None:
                return Response({'error': 'Model not loaded.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

            player_name = request.data.get('player')
            opponent = request.data.get('opponent')
            home = request.data.get('home', 1)
            game_date_str = request.data.get('game_date', None)

            if not player_name or not opponent:
                return Response({'error': 'Missing player or opponent field'}, status=status.HTTP_400_BAD_REQUEST)

            player = Player.objects.filter(name__iexact=player_name).first()
            if not player:
                return Response({'error': f'Player "{player_name}" not found.'}, status=status.HTTP_404_NOT_FOUND)

            qs = PlayerGameStat.objects.filter(player=player).order_by('-game_date')[:50].values()
            df = pd.DataFrame(list(qs))
            if df.empty:
                return Response({'error': f'No game stats found for player "{player_name}".'}, status=status.HTTP_400_BAD_REQUEST)

            df['game_date'] = pd.to_datetime(df['game_date'])
            last_game_date = df['game_date'].max()
            game_date = pd.to_datetime(game_date_str) if game_date_str else last_game_date + pd.Timedelta(days=1)

            df = pd.concat([df, pd.DataFrame([{
                'player_id': player.pk,
                'game_date': game_date,
                'opponent': opponent,
                'home': home,
                **{col: None for col in [
                    'minutes', 'points', 'assists', 'blocks', 'steals', 'fg_percent',
                    'threepa', 'threep', 'threep_percent', 'fta', 'ft', 'ft_percent',
                    'total_rebounds', 'personal_fouls', 'turnovers'
                ]}
            }])])

            df = add_recent_average_features(df)
            df['opponent'] = df['opponent'].astype('category').cat.codes

            feature_cols = [
                'player_id', 'rest_days', 'opponent', 'home',
                'avg_minutes_last5', 'avg_points_last5', 'avg_assists_last5',
                'avg_blocks_last5', 'avg_steals_last5', 'avg_fg_percent_last5',
                'avg_threepa_last5', 'avg_threep_last5', 'avg_threep_percent_last5',
                'avg_fta_last5', 'avg_ft_last5', 'avg_ft_percent_last5',
                'avg_total_rebounds_last5', 'avg_personal_fouls_last5',
                'avg_turnovers_last5', 'avg_did_play_last10'
            ]
            latest = df.sort_values('game_date').iloc[-1]
            features = latest[feature_cols].values.reshape(1, -1)
            prediction = model.predict(features)[0]

            stat_names = [
                'minutes', 'points', 'assists', 'blocks', 'steals', 'fg_percent',
                'threepa', 'threep', 'threep_percent', 'fta', 'ft', 'ft_percent',
                'total_rebounds', 'personal_fouls', 'turnovers'
            ]
            result = dict(zip(stat_names, prediction))
            return Response({'player': player_name, 'opponent': opponent, 'predictions': result})

        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)