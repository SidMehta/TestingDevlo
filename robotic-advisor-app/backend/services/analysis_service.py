from . import llm_service

def calculate_roi(human_cost, robot_cost, timeline, efficiency_factor=1.0):
    """
    Calculate Return on Investment for robot automation.
    
    Args:
        human_cost (float): Hourly cost of human labor
        robot_cost (dict): Robot costs including purchase and operational
        timeline (int): Timeline in months for ROI calculation
        efficiency_factor (float): Efficiency multiplier (1.0 = same as human)
        
    Returns:
        dict: ROI analysis including breakeven point and savings
    """
    # Convert timeline to hours (assuming 8 hour days, 22 work days per month)
    hours_per_month = 8 * 22
    total_hours = timeline * hours_per_month
    
    # Calculate human labor cost over the timeline
    total_human_cost = human_cost * total_hours
    
    # Calculate robot cost over the timeline
    purchase_price = robot_cost.get('purchase_price', 0)
    operational_cost_per_hour = robot_cost.get('operational_cost', 0)
    total_operational_cost = operational_cost_per_hour * total_hours
    total_robot_cost = purchase_price + total_operational_cost
    
    # Apply efficiency factor (robots might be faster or slower than humans)
    effective_robot_cost = total_robot_cost / efficiency_factor
    
    # Calculate savings
    savings = total_human_cost - effective_robot_cost
    
    # Calculate breakeven point in months
    if human_cost > operational_cost_per_hour and human_cost > 0:
        hourly_savings = human_cost - operational_cost_per_hour
        hours_to_breakeven = purchase_price / hourly_savings
        months_to_breakeven = hours_to_breakeven / hours_per_month
    else:
        months_to_breakeven = float('inf')  # No breakeven if robot costs more to operate
    
    return {
        "total_human_cost": total_human_cost,
        "total_robot_cost": effective_robot_cost,
        "savings": savings,
        "breakeven_months": months_to_breakeven,
        "roi_percentage": (savings / total_robot_cost * 100) if total_robot_cost > 0 else 0
    }

def generate_analysis(video_analysis, robot_options, timeline, human_cost, robot_cost):
    """
    Generate comprehensive analysis of automation options.
    
    Args:
        video_analysis (dict): Results from video analysis
        robot_options (list): Available robot options
        timeline (int): Timeline in months for ROI calculation
        human_cost (float): Hourly cost of human labor
        robot_cost (float): Additional robot cost information
        
    Returns:
        dict: Complete analysis including recommendations and ROI
    """
    # Get recommendations from LLM service
    recommendations = llm_service.generate_recommendations(video_analysis, robot_options)
    
    # Calculate ROI for each recommended robot
    for recommendation in recommendations:
        robot_id = recommendation.get('robot_id')
        efficiency = recommendation.get('estimated_efficiency', 1.0)
        
        # Find the robot in options
        for robot in robot_options:
            if robot.get('id') == robot_id:
                robot_cost_data = {
                    'purchase_price': robot.get('purchase_price', 0),
                    'operational_cost': robot.get('operational_cost', 0)
                }
                
                # Calculate ROI
                roi_analysis = calculate_roi(
                    human_cost, 
                    robot_cost_data, 
                    timeline, 
                    efficiency
                )
                
                # Add ROI analysis to recommendation
                recommendation['roi_analysis'] = roi_analysis
                break
    
    return {
        "video_analysis": video_analysis,
        "recommendations": recommendations,
        "timeline_months": timeline,
        "human_hourly_cost": human_cost
    }