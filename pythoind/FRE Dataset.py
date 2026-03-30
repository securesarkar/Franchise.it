import csv
import random

# -------------------------
# REAL ADDRESS POOL
# -------------------------

addresses = [
"Connaught Place, New Delhi, Delhi 110001",
"Park Street, Kolkata, West Bengal 700016",
"Linking Road, Bandra West, Mumbai, Maharashtra 400050",
"Brigade Road, Bengaluru, Karnataka 560001",
"Banjara Hills Road No 12, Hyderabad, Telangana 500034",
"T Nagar Ranganathan Street, Chennai, Tamil Nadu 600017",
"FC Road, Shivajinagar, Pune, Maharashtra 411005",
"SG Highway, Ahmedabad, Gujarat 380015",
"MI Road, Jaipur, Rajasthan 302001",
"Hazratganj Market, Lucknow, Uttar Pradesh 226001",
"Sector 17 Plaza, Chandigarh 160017",
"Janpath Road, Bhubaneswar, Odisha 751001",
"MG Road, Kochi, Kerala 682016",
"Vijay Nagar Square, Indore, Madhya Pradesh 452010",
"Ring Road, Surat, Gujarat 395002",
"Sadar Bazaar, Nagpur, Maharashtra 440001",
"Fraser Road Area, Patna, Bihar 800001",
"GS Road, Guwahati, Assam 781005",
"MP Nagar Zone 1, Bhopal, Madhya Pradesh 462011",
"Sector 18 Market, Noida, Uttar Pradesh 201301"
]

# -------------------------
# NAME DATA
# -------------------------

first_names = [
"Aarav","Vivaan","Aditya","Arjun","Ishaan","Rohan","Karan","Rahul",
"Aman","Varun","Neeraj","Ritesh","Manish","Nikhil","Priya","Ananya",
"Ishita","Sneha","Riya","Pooja","Kavya","Neha","Aditi","Shruti"
]

last_names = [
"Sharma","Verma","Gupta","Agarwal","Mehta","Kapoor","Bansal",
"Jain","Sarkar","Chatterjee","Banerjee","Das","Roy","Patil",
"Reddy","Nair","Menon","Shetty","Iyer"
]

asset_types = [
"Commercial Shop",
"Food Court Stall",
"Retail Space",
"Restaurant Space",
"Mall Kiosk",
"Standalone Building"
]

traits = [
"Visionary Innovator",
"Strategic Planner",
"Persuasive Networker",
"Resilient Builder",
"Confident Leader",
"Opportunity Hunter",
"Adaptive Problem Solver",
"Execution Specialist"
]

rows = []

for i in range(2000):

    first = random.choice(first_names)
    last = random.choice(last_names)

    asset_type = random.choice(asset_types)

    size = random.randint(200, 3500)

    location = random.choice(addresses)

    liquid_asset = random.choice([
        0,
        random.randint(200000,3000000),
        random.randint(3000000,15000000)
    ])

    personality = random.sample(traits,3)

    email = f"{first.lower()}.{last.lower()}{random.randint(1,9999)}@gmail.com"

    rows.append([
        first,
        last,
        asset_type,
        size,
        location,
        liquid_asset,
        personality[0],
        personality[1],
        personality[2],
        "HORECA",
        email
    ])

headers = [
"First Name",
"Last Name",
"Asset Type",
"Asset Size SqFt",
"Asset Address",
"Liquid Asset INR",
"Trait 1",
"Trait 2",
"Trait 3",
"Preferred Industry",
"Email"
]

with open("franchisee_dataset_2000.csv","w",newline='',encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print("franchisee_dataset_2000.csv generated")