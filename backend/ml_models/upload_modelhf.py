from os import path
from huggingface_hub import HfApi

api = HfApi()

repo_id= "JustinTran67/nbamodel"

# I was mad struggling with this :( use absolute path!
local_file= "/Users/justintran/Downloads/NBA-Performance-Predictor/backend/ml_models/player_multioutput_projection.pkl"

api.upload_file(
    path_or_fileobj= local_file,
    path_in_repo= "player_multioutput_projection.pkl",
    repo_id= repo_id,
    repo_type= "model",
    token=None
)

print("Uploaded.")