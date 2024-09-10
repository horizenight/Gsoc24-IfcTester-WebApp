---
Author: Kshitij Roodkee
Title: "BRL-CAD: IfcOpenShell: IfcTester WebApp"
Subject: GSoC 2024 Proposal
---

# Contact Information

- **Name**: Kshitij Roodkee
- **Email**: <small>kshitijroodkeee1@gmail.com</small>
- **IRC Username**: horizenight
- **GitHub**: [horizenight](https://github.com/horizenight)
- **Timezone**: GMT+5:30 IST (Indian Standard Time)
- **Have I ever contributed in open source before?**: Yes, I was selected for Linux Foundation Mentorship as part of Hyperledger in 2023.
- **Brief Background Info**: I have a strong proficiency in web development, with extensive experience working with JavaScript, Python, and various web frameworks. I have successfully completed numerous projects across these technologies, showcasing my versatility and capability to build effective and innovative web solutions.

# Project Overview

## Summary:

The project aims to seamlessly integrate three powerful tools — BlenderBIM Add-on, IfcOpenShell software, and Radiance — for the creation of detailed and scientifically accurate 3D renders of buildings. While BlenderBIM and IfcOpenShell enable users to construct intricate 3D models of structures, Radiance specializes in performing light simulations, ensuring renders are not only visually appealing but also photometrically correct.

## Key Components:

1. BlenderBIM Add-on and IfcOpenShell:

- These tools serve as the foundation for building complex 3D models, allowing users to capture the intricate details of architectural designs.

2. Radiance:

- Utilized for light simulation, Radiance contributes to the creation of visually stunning renders that adhere to scientific accuracy principles.

# Project Breakdown

## 1. **Python scripts for IFC to OBJ conversion and text file generation:**

### Objective:

Develop Python scripts that take an input 3D IFC model and generate OBJ files and accompanying text files compatible with Radiance.

### Approach:

- We can mplement a Python script to parse and convert IFC geometry into OBJ format.
- We can script to generate the necessary text files for Radiance, ensuring correct material and scene descriptions.

## Sample Code for exporting the selected object in OBJ along with a .txt file containing dummy data:

![Code 1 Image](images/code-1.png)
![Code 1 GUI Image](images/code-1-GUI.png)
![Code 1 Output Image](images/code-1-output.png)

## 2. Settings for object filtering, object count limits, object geometry substitution, material mapping:

### Objective:

Implement settings to control various aspects of the conversion process.

### Approach:

- Create user-configurable settings in the Blender UI to handle object filtering based on criteria such as object type or properties.
- Allow users to set limits on the number of objects processed during the conversion.
- Provide options for substituting complex geometry with simplified representations for efficient light simulation.
- We can implement material mapping and substitution settings to ensure compatibility with Radiance.

## Sample Code for Swapping IFC Models:

![Code 2 Image](images/code-2.png)
![Code 2 GUI Image](images/code-2-GUI.png)

## Sample Code for Swapping Materials:

![Code 3 Image](images/code-3.png)
![Code 3 GUI Image](images/code-3-GUI.png)

## 4. Single plane substitution for glazing:

### Objective:

Address the specific requirement of substituting cuboid glazing with a flat plane for accurate light simulation.

### Approach:

- Identify glazing elements in the IFC model and develop a script to replace cuboid geometry with a single plane.
- Ensure that the replacement maintains the necessary material properties for accurate light simulation.

## 5. Choose from preset sky settings and automatic materials:

### Objective:

Enable users to select preset sky settings and automate material assignments for convenience.

### Approach:

- Implement a dropdown or menu in the Blender UI to choose from a range of preset sky settings for light simulation.
- Develop a script to automatically assign appropriate materials based on predefined parameters, simplifying the user's workflow.

![Code 4 Image](images/code-4.png)
![Code 4 GUI Image](images/code-4-GUI.png)

# Mock up Visual of Blender GUI

![Code 4 Image](images/Mockup-visual.png)

# FLOW CHART

![Code 4 Image](images/flow-chart.png)

# Development Schedule

| Week       | Hours    | Task                                              | Description                                                                                                                                                                      |
| ---------- | -------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Week 1-2   | 20 hours | Project Kick off and Setup                        | Review project requirements and specifications. Set up the development environment. Familiarize with BlenderBIM Add-on and Radiance.                                             |
| Week 3-4   | 40 hours | IFC to OBJ Conversion Script                      | Develop Python script for basic IFC to OBJ conversion. Test the script with sample IFC models. Address any initial issues or challenges.                                         |
| Week 5-6   | 40 hours | Text File Generation Script                       | Implement Python script for generating text files compatible with Radiance. Test the script with different scenes and materials. Refine and optimize the script for performance. |
| Week 7-8   | 40 hours | Graphical Interface in Blender                    | Design and implement the Blender UI for the integration. Integrate the conversion scripts into the UI. Implement file input/output functionalities.                              |
| Week 9-10  | 30 hours | Object Filtering and Count Limits                 | Develop settings for object filtering in the Blender UI. Allow users to set object count limits during conversion. Test and refine settings for optimal performance.             |
| Week 11-12 | 30 hours | Object Geometry Substitution and Material Mapping | Implement settings for object geometry substitution. Develop material mapping and substitution options. Test the functionality with diverse model scenarios.                     |
| Week 13-14 | 40 hours | Single Plane Substitution for Glazing             | Identify glazing elements in the IFC model. Develop a script for single plane substitution. Test and refine the script for accurate light simulation.                            |
| Week 15-16 | 50 hours | Preset Sky Settings and Automatic Materials       | Implement dropdown/menu for preset sky settings in the UI. Develop a script for automatic material assignment. Conduct comprehensive testing and debugging.                      |
| Buffer     | 20 hours | Buffer Time                                       | Allocate 20 hours for unforeseen issues, additional testing, and final adjustments.                                                                                              |

# Time Availability

During the contribution period, daily I’ll be able to put in 5 hours/day (30 hours a week) working remotely from Bangalore, India.
10:00 am to 12:00pm IST – 2 hours
6:00 pm to 9:00pm IST – 3 hours

# Why BRL-CAD ?

Contributing to BRL-CAD is an excellent opportunity for several reasons. First and foremost, BRL-CAD has a rich history, dating back to the late 1970s, showcasing its stability and long-term commitment to the open-source community. Your contribution would become part of a legacy that has stood the test of time.

BRL-CAD's versatile applications across various industries, including CAD, computer graphics, and scientific computing, make it a project with diverse use cases. Your involvement could have a significant impact on a tool used in engineering, architecture, virtual reality, and simulation.

# Why Me ?

As my profile closely matches the tech stack used in BRL-CAD—particularly my expertise in Blender, Python scripting, and 3D rendering and animation. My skills align seamlessly with the project's needs, making it an ideal opportunity for me to leverage my existing knowledge while expanding my expertise in a challenging and impactful open-source environment.

Recently in 2023, I was also selected for XR Open-Source (XROS) Contribution Program organised by Meta.

[My Linkedin](https://www.linkedin.com/in/chiragsingh1711/)

# Related Work

Yes, I have worked on a similar project in which the idea was to connect Stable Diffusion with Blender through Blender python scripting.

- A very low poly sample scene would first be created along with a camera in Blender.
- Depth Map of the scene would be generated and sent to Stable Diffusion API along with a prompt that the user may input in the Blender GUI.
- On receiving the output image from Stable Diffusion, the image will then be UV Mapped to the scene from the camera’s perspective.
- Now the user may upload a product to the scene and render high quality images and animations with 3D AI backgrounds.
- (All the above-mentioned tasks were automated using Python)

I also have tons of experience with using Blender for modelling and animation.