import os
import json
import xml.etree.ElementTree as ET

def parse_urdf_file(file_path):
    """
    Parse a URDF file to extract robot specifications.
    
    Args:
        file_path (str): Path to the URDF file
        
    Returns:
        dict: Robot specifications extracted from the URDF
    """
    try:
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # Extract basic robot information
        robot_name = root.get('name', 'Unknown')
        
        # Count joints and links
        joints = root.findall('.//joint')
        links = root.findall('.//link')
        
        # Extract joint types
        joint_types = {}
        for joint in joints:
            joint_type = joint.get('type', 'unknown')
            if joint_type in joint_types:
                joint_types[joint_type] += 1
            else:
                joint_types[joint_type] = 1
        
        return {
            "name": robot_name,
            "joint_count": len(joints),
            "link_count": len(links),
            "joint_types": joint_types,
            "file_path": file_path
        }
    except Exception as e:
        print(f"Error parsing URDF file {file_path}: {e}")
        return None

def get_robot_metadata():
    """
    Load robot metadata from the JSON file.
    
    Returns:
        dict: Robot metadata including costs and specifications
    """
    metadata_path = os.path.join('assets', 'robot_metadata.json')
    try:
        with open(metadata_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading robot metadata: {e}")
        # Return empty dict if file doesn't exist or has issues
        return {}

def get_robot_options():
    """
    Get all available robot options by parsing URDF files and combining with metadata.
    
    Returns:
        list: Available robot options with specifications and costs
    """
    # Get metadata for all robots
    metadata = get_robot_metadata()
    
    # Get all URDF files in the assets/urdfs directory
    urdf_dir = os.path.join('assets', 'urdfs')
    urdf_files = [f for f in os.listdir(urdf_dir) if f.endswith('.urdf')]
    
    robot_options = []
    
    for urdf_file in urdf_files:
        file_path = os.path.join(urdf_dir, urdf_file)
        robot_id = os.path.splitext(urdf_file)[0]  # Remove .urdf extension
        
        # Parse URDF file
        urdf_data = parse_urdf_file(file_path)
        
        if urdf_data and robot_id in metadata:
            # Combine URDF data with metadata
            robot_option = {
                "id": robot_id,
                "specifications": urdf_data,
                "purchase_price": metadata[robot_id].get("purchase_price", 0),
                "operational_cost": metadata[robot_id].get("operational_cost", 0),
                "capabilities": metadata[robot_id].get("capabilities", []),
                "maintenance_interval": metadata[robot_id].get("maintenance_interval", 0)
            }
            robot_options.append(robot_option)
    
    # If no robots found or parsed, return sample data
    if not robot_options:
        robot_options = [
            {
                "id": "example_robot_1",
                "specifications": {
                    "name": "Example Robot 1",
                    "joint_count": 6,
                    "link_count": 7,
                    "joint_types": {"revolute": 6}
                },
                "purchase_price": 50000,
                "operational_cost": 15,
                "capabilities": ["pick_and_place", "assembly"],
                "maintenance_interval": 2000
            },
            {
                "id": "example_robot_2",
                "specifications": {
                    "name": "Example Robot 2",
                    "joint_count": 7,
                    "link_count": 8,
                    "joint_types": {"revolute": 6, "prismatic": 1}
                },
                "purchase_price": 75000,
                "operational_cost": 20,
                "capabilities": ["pick_and_place", "assembly", "inspection"],
                "maintenance_interval": 1500
            }
        ]
    
    return robot_options