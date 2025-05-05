import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Import your service modules (create these files later)
from services import llm_service, urdf_service, analysis_service

app = Flask(__name__)
# Allow requests from your React app's origin (adjust port if needed)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/')
def hello():
    return "Hello from Backend!"

@app.route('/api/analyze', methods=['POST'])
def analyze_endpoint():
    # Get inputs from request
    data = request.json
    print("Received data:", data)
    # 1. Get inputs: video_url, timeline, human_cost, robot_cost from data
    video_url = data.get('video_url')
    timeline = data.get('timeline')
    human_cost = data.get('human_cost')
    robot_cost = data.get('robot_cost')
    
    # 2. Call video analysis (llm_service)
    video_analysis = llm_service.analyze_video(video_url)
    
    # 3. Parse URDFs (urdf_service) - load from assets/
    robot_options = urdf_service.get_robot_options()
    
    # 4. Generate options (analysis_service + llm_service)
    # 5. Cost analysis (analysis_service + llm_service)
    analysis_results = analysis_service.generate_analysis(
        video_analysis, 
        robot_options, 
        timeline, 
        human_cost, 
        robot_cost
    )
    
    # 6. Format results
    return jsonify({
        "message": "Analysis completed",
        "input_data": data,
        "results": analysis_results
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Runs on http://localhost:5000