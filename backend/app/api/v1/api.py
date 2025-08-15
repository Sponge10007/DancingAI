from fastapi import APIRouter

from . import videos, beats, poses

api_router = APIRouter()

# 包含各个模块的路由
api_router.include_router(videos.router, prefix="/videos", tags=["videos"])
api_router.include_router(beats.router, prefix="/beats", tags=["beats"])
api_router.include_router(poses.router, prefix="/poses", tags=["poses"])

# 后续会添加更多路由
# api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])
