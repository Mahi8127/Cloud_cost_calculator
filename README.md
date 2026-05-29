# Cloud Cost Calculator ☁️

A web-based Cloud Cost Calculator that estimates and compares monthly infrastructure costs across **AWS, Google Cloud, and Microsoft Azure** using an interactive and modern UI.

## Features
- Multi-cloud cost comparison
- AWS, GCP, and Azure support
- Compute (VM) pricing estimates
- Storage cost estimation
- Database pricing calculation
- Networking and transfer cost analysis
- Interactive sliders and toggles
- Monthly and yearly cost breakdown
- Visual comparison charts

## Tech Stack
- HTML5
- CSS3
- JavaScript

## Project Structure
Cloud_Cost_Calculator/
│
├── index.html
├── style.css
├── script.js
└── README.md

## Installation

### Clone Repository
```bash
git clone YOUR_REPO_LINK
cd Cloud_Cost_Calculator
```

## How to Use

### Run the Project
Simply open:

```bash
index.html
```

or use VS Code Live Server.

### Steps
1. Open the calculator
2. Enable services using toggle switches:
   - Compute
   - Storage
   - Database
   - Networking
3. Configure cloud resources:
   - Instance type
   - Storage size
   - Database configuration
   - Data transfer
4. Click **Calculate Monthly Cost**
5. Compare:
   - AWS cost
   - GCP cost
   - Azure cost
6. View:
   - Monthly estimates
   - Yearly estimates
   - Provider comparison chart
   - Lowest-cost provider

## How It Works
1. User selects cloud services and resources
2. JavaScript pricing tables store provider pricing
3. Cost is calculated based on:
   - Usage
   - Hours
   - Storage
   - Network transfer
4. Results are displayed with detailed breakdowns and visual charts.

## Features Breakdown
### Compute
Estimate VM pricing based on instance type and hours.

### Storage
Calculate storage costs using cloud storage tiers.

### Database
Compare managed database pricing and storage usage.

### Networking
Estimate outbound and transfer costs across providers.

## Notes
- Uses estimated on-demand pricing
- Prices may vary by region and provider updates
- Designed for learning and cost planning

