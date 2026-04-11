from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter(prefix="/config", tags=["config"])

@router.get("/agent")
def get_agent_config():
    """Expose agent.config.json for AI agent workflow"""
    config_path = os.path.join(os.getcwd(), "agent.config.json")
    
    if not os.path.exists(config_path):
        raise HTTPException(status_code=404, detail="agent.config.json not found")
    
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)
    
    return config
