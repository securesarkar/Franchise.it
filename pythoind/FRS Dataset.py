import csv
import random

# -------------------------
# REAL ADDRESSES
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
"Ring Road, Surat, Gujarat 395002"
]

asset_types = [
"Commercial Shop",
"Food Court Stall",
"Restaurant Space",
"Retail Space",
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

classy = ["Royal","Imperial","Urban","Heritage","Golden","Velvet","Elite"]
fun = ["Chai","Masala","Tandoor","Biryani","Hungry","Spice","Desi"]
massy = ["Bombay","Punjab","Delhi","Kolkata","Madras","Hyderabadi"]

suffix = ["Cafe","Kitchen","Bistro","Adda","Dhaba","Street","Corner","House"]

def generate_brand():
    style = random.choice(["classy","fun","massy"])
    
    if style=="classy":
        return random.choice(classy)+" "+random.choice(suffix)
    
    if style=="fun":
        return random.choice(fun)+" "+random.choice(suffix)
    
    return random.choice(massy)+" "+random.choice(suffix)

rows=[]

for i in range(2000):

    brand = generate_brand()

    asset_type = random.choice(asset_types)

    size = random.randint(300,4000)

    location = random.choice(addresses)

    investment = random.choice([
        0,
        random.randint(500000,5000000),
        random.randint(5000000,20000000)
    ])

    personality = random.sample(traits, random.randint(1,3))

    email = brand.replace(" ","").lower()+str(random.randint(1,9999))+"@business.com"

    rows.append([
        brand,
        asset_type,
        size,
        location,
        investment,
        ", ".join(personality),
        "HORECA",
        email
    ])

headers=[
"Brand Name",
"Required Asset Type",
"Required Asset Size SqFt",
"Preferred Address",
"Required Investment INR",
"Expected Personality Traits",
"Industry",
"Contact Email"
]

with open("franchisor_dataset_2000.csv","w",newline='',encoding="utf-8") as f:
    writer=csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print("franchisor_dataset_2000.csv generated")