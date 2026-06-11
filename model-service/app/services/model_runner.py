import pandas as pd
import numpy as np
from datetime import timedelta
from typing import List, Dict, Any

def run_forecast_model(df: pd.DataFrame, horizon: int) -> Dict[str, Any]:
    """
    TODO: Implement baseline ML model execution logic here.
    Current implementation generates mock forecast data for demonstration.
    """
    # Mock inference logic
    last_date = pd.to_datetime(df['date']).max()
    entities = df['entity_name'].unique()
    
    forecast_results = []
    
    for entity in entities:
        entity_df = df[df['entity_name'] == entity]
        avg_value = float(entity_df['actual_value'].mean())
        
        for i in range(1, horizon + 1):
            forecast_date = last_date + timedelta(days=i)
            # Simple mock prediction: average + some random noise
            predicted_value = avg_value * (1 + (np.random.rand() - 0.5) * 0.1)
            
            forecast_results.append({
                "forecast_date": forecast_date.isoformat(),
                "entity_name": entity,
                "predicted_value": predicted_value,
                "lower_bound": predicted_value * 0.9,
                "upper_bound": predicted_value * 1.1
            })
            
    # Mock metrics
    metrics = {
        "mae": float(np.random.rand() * 10),
        "rmse": float(np.random.rand() * 15),
        "mape": float(np.random.rand() * 5)
    }
    
    return {
        "forecast": forecast_results,
        "metrics": metrics
    }
