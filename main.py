import json
import random
from datetime import datetime, timedelta

tickets = []
months = [
    "2025-10", "2025-11", "2025-12", 
    "2026-01", "2026-02", "2026-03", 
    "2026-04", "2026-05"
]

ticket_id = 1

for month_str in months:
    year, month = map(int, month_str.split("-"))
    num_tickets = random.randint(6, 10)  # 6-10 tickets per month
    for _ in range(num_tickets):
        # Random day in the month
        day = random.randint(1, 28)
        hour = random.randint(8, 18)
        minute = random.randint(0, 59)
        created_at = datetime(year, month, day, hour, minute).isoformat() + "Z"

        ticket = {
            "title": f"Ticket {ticket_id}",
            "description": f"Description for ticket {ticket_id}",
            "created_at": created_at,
            "severity": "low",
            "status": "assessing",
            "ticket_type": 1
        }
        tickets.append(ticket)
        ticket_id += 1

# Print JSON payload
print(json.dumps(tickets, indent=2))
