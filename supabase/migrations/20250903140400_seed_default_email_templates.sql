-- Seed default email templates for SWMS campaigns

-- Initial SWMS Request Template
INSERT INTO swms_email_templates (
    template_type,
    subject_template,
    html_template,
    text_template,
    is_active
) VALUES (
    'initial',
    'SWMS Required: {{job_name}} - Action Required',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SWMS Required</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">Bayside Builders WA</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Safe Work Method Statement Required</p>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1e40af; margin-top: 0;">Hi {{contractor_name}},</h2>
        
        <p>We require your <strong>Safe Work Method Statement (SWMS)</strong> for the upcoming project:</p>
        
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1e40af;">Job Details</h3>
            <p style="margin: 5px 0;"><strong>Project:</strong> {{job_name}}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> {{job_site_name}}, {{job_site_address}}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> {{due_date}}</p>
            <p style="margin: 5px 0;"><strong>Days Remaining:</strong> {{days_remaining}} days</p>
        </div>
        
        <p>Please submit your SWMS documentation using our secure portal:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{portal_url}}" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Submit SWMS Documents
            </a>
        </div>
        
        <p style="font-size: 14px; color: #64748b;">This secure link will expire 30 days from today. If you need assistance, please contact us:</p>
        
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> {{contact_phone}}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> {{contact_email}}</p>
        </div>
        
        <p>Thank you for your attention to workplace safety.</p>
        
        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Bayside Builders WA Team</strong>
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; font-size: 12px; color: #64748b;">
        <p>This email was sent from an automated system. Please do not reply directly to this email.</p>
    </div>
</body>
</html>',
    'SWMS Required: {{job_name}}

Hi {{contractor_name}},

We require your Safe Work Method Statement (SWMS) for the upcoming project:

Job Details:
- Project: {{job_name}}
- Location: {{job_site_name}}, {{job_site_address}}
- Due Date: {{due_date}}
- Days Remaining: {{days_remaining}} days

Please submit your SWMS documentation using our secure portal:
{{portal_url}}

This secure link will expire 30 days from today.

If you need assistance, please contact us:
Phone: {{contact_phone}}
Email: {{contact_email}}

Thank you for your attention to workplace safety.

Best regards,
Bayside Builders WA Team',
    true
);

-- 7-Day Reminder Template
INSERT INTO swms_email_templates (
    template_type,
    subject_template,
    html_template,
    text_template,
    is_active
) VALUES (
    'reminder_7',
    'SWMS Reminder: {{job_name}} - {{days_remaining}} days remaining',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>SWMS Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #ea580c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">⚠️ SWMS Reminder</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Bayside Builders WA</p>
    </div>
    
    <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #ea580c; margin-top: 0;">Hi {{contractor_name}},</h2>
        
        <p><strong>Friendly reminder:</strong> We still need your SWMS documentation for:</p>
        
        <div style="background: white; border: 2px solid #fed7aa; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #ea580c;">{{job_name}}</h3>
            <p style="margin: 5px 0;"><strong>Location:</strong> {{job_site_name}}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> {{due_date}}</p>
            <p style="margin: 5px 0; color: #ea580c; font-weight: bold;">⏰ Only {{days_remaining}} days remaining!</p>
        </div>
        
        <p>Please submit your documents as soon as possible to avoid any delays:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{portal_url}}" 
               style="background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
                Submit SWMS Now
            </a>
        </div>
        
        <p>Need help? Contact our team:</p>
        <div style="background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Phone:</strong> {{contact_phone}}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Email:</strong> {{contact_email}}</p>
        </div>
        
        <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Bayside Builders WA Team</strong>
        </p>
    </div>
</body>
</html>',
    'SWMS Reminder: {{job_name}} - {{days_remaining}} days remaining

Hi {{contractor_name}},

Friendly reminder: We still need your SWMS documentation for:

{{job_name}}
Location: {{job_site_name}}
Due Date: {{due_date}}
⏰ Only {{days_remaining}} days remaining!

Please submit your documents as soon as possible:
{{portal_url}}

Need help? Contact our team:
Phone: {{contact_phone}}
Email: {{contact_email}}

Best regards,
Bayside Builders WA Team',
    true
);

-- 14-Day Escalation Template
INSERT INTO swms_email_templates (
    template_type,
    subject_template,
    html_template,
    text_template,
    is_active
) VALUES (
    'reminder_14',
    'URGENT: SWMS Required - {{job_name}} ({{days_remaining}} days left)',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Urgent SWMS Required</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 26px;">🚨 URGENT ACTION REQUIRED</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 18px;">SWMS Documentation Missing</p>
    </div>
    
    <div style="background: #fef2f2; padding: 30px; border: 2px solid #fca5a5; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #dc2626; margin-top: 0;">Hi {{contractor_name}},</h2>
        
        <p><strong style="color: #dc2626;">URGENT:</strong> We have not yet received your SWMS documentation. This is required before work can commence.</p>
        
        <div style="background: white; border: 3px solid #dc2626; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #dc2626;">{{job_name}}</h3>
            <p style="margin: 5px 0;"><strong>Location:</strong> {{job_site_name}}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> {{due_date}}</p>
            <p style="margin: 5px 0; color: #dc2626; font-weight: bold; font-size: 18px;">⚠️ ONLY {{days_remaining}} DAYS LEFT!</p>
        </div>
        
        <div style="background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #dc2626;">
                Without your SWMS documentation, we cannot proceed with the project as scheduled. 
                This may result in delays and additional costs.
            </p>
        </div>
        
        <p><strong>Please submit immediately:</strong></p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{portal_url}}" 
               style="background: #dc2626; color: white; padding: 20px 40px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 18px; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">
                SUBMIT SWMS NOW
            </a>
        </div>
        
        <p><strong>Need immediate assistance?</strong> Contact us right away:</p>
        <div style="background: white; border: 2px solid #dc2626; border-radius: 6px; padding: 15px; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 16px;"><strong>📞 Phone:</strong> {{contact_phone}}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>✉️ Email:</strong> {{contact_email}}</p>
        </div>
        
        <p style="margin-top: 30px;">
            Urgent regards,<br>
            <strong>Bayside Builders WA Team</strong>
        </p>
    </div>
</body>
</html>',
    'URGENT: SWMS Required - {{job_name}} ({{days_remaining}} days left)

Hi {{contractor_name}},

🚨 URGENT: We have not yet received your SWMS documentation. This is required before work can commence.

{{job_name}}
Location: {{job_site_name}}
Due Date: {{due_date}}
⚠️ ONLY {{days_remaining}} DAYS LEFT!

WARNING: Without your SWMS documentation, we cannot proceed with the project as scheduled. This may result in delays and additional costs.

Please submit immediately:
{{portal_url}}

Need immediate assistance? Contact us right away:
📞 Phone: {{contact_phone}}
✉️ Email: {{contact_email}}

Urgent regards,
Bayside Builders WA Team',
    true
);

-- Final Notice Template
INSERT INTO swms_email_templates (
    template_type,
    subject_template,
    html_template,
    text_template,
    is_active
) VALUES (
    'final_21',
    'FINAL NOTICE: SWMS Compliance Deadline - {{job_name}}',
    '<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Final Notice - SWMS Required</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: #7f1d1d; color: white; padding: 25px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">⛔ FINAL NOTICE</h1>
        <p style="margin: 10px 0 0 0; font-size: 20px; font-weight: bold;">SWMS Compliance Deadline</p>
    </div>
    
    <div style="background: #fef2f2; padding: 30px; border: 3px solid #b91c1c; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #7f1d1d; margin-top: 0;">{{contractor_name}},</h2>
        
        <div style="background: #fee2e2; border: 2px solid #b91c1c; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #7f1d1d; text-align: center;">
                🚫 FINAL NOTICE: SWMS DOCUMENTATION OVERDUE 🚫
            </p>
        </div>
        
        <p><strong>This is our final request</strong> for your Safe Work Method Statement documentation for:</p>
        
        <div style="background: white; border: 3px solid #b91c1c; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #7f1d1d; font-size: 20px;">{{job_name}}</h3>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Location:</strong> {{job_site_name}}</p>
            <p style="margin: 5px 0; font-size: 16px;"><strong>Original Due Date:</strong> {{due_date}}</p>
            <p style="margin: 15px 0 0 0; color: #7f1d1d; font-weight: bold; font-size: 20px;">
                ⏰ {{days_remaining}} DAYS OVERDUE
            </p>
        </div>
        
        <div style="background: #7f1d1d; color: white; border-radius: 6px; padding: 20px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: white;">⚠️ COMPLIANCE WARNING</h3>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Work cannot commence without approved SWMS documentation</li>
                <li>Project delays may incur additional costs</li>
                <li>Non-compliance may affect future project opportunities</li>
                <li>Work Safe WA requires all contractors to have current SWMS</li>
            </ul>
        </div>
        
        <p style="font-size: 18px; text-align: center; margin: 30px 0;">
            <strong>Submit your SWMS documentation immediately:</strong>
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{portal_url}}" 
               style="background: #7f1d1d; color: white; padding: 25px 50px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 20px; box-shadow: 0 6px 12px rgba(127, 29, 29, 0.4); text-transform: uppercase;">
                SUBMIT NOW - FINAL CHANCE
            </a>
        </div>
        
        <div style="background: #fee2e2; border-left: 5px solid #b91c1c; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; font-size: 16px; color: #7f1d1d;">
                <strong>If we do not receive your SWMS documentation within 24 hours, 
                we will need to discuss alternative arrangements for this project.</strong>
            </p>
        </div>
        
        <p><strong>Contact us immediately if you need assistance:</strong></p>
        <div style="background: white; border: 2px solid #b91c1c; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 5px 0; font-size: 18px; color: #7f1d1d;"><strong>📞 {{contact_phone}}</strong></p>
            <p style="margin: 5px 0; font-size: 18px; color: #7f1d1d;"><strong>✉️ {{contact_email}}</strong></p>
            <p style="margin: 15px 0 5px 0; font-size: 14px;">Available Monday-Friday, 7:00 AM - 5:00 PM</p>
        </div>
        
        <p style="margin-top: 40px; text-align: center;">
            <strong>Final Notice Issued by:</strong><br>
            <strong style="font-size: 18px; color: #7f1d1d;">Bayside Builders WA</strong><br>
            <em>Work Safe WA Licensed Builder</em>
        </p>
    </div>
</body>
</html>',
    'FINAL NOTICE: SWMS Compliance Deadline - {{job_name}}

{{contractor_name}},

⛔ FINAL NOTICE: SWMS DOCUMENTATION OVERDUE ⛔

This is our final request for your Safe Work Method Statement documentation for:

{{job_name}}
Location: {{job_site_name}}
Original Due Date: {{due_date}}
⏰ {{days_remaining}} DAYS OVERDUE

⚠️ COMPLIANCE WARNING:
- Work cannot commence without approved SWMS documentation
- Project delays may incur additional costs
- Non-compliance may affect future project opportunities
- Work Safe WA requires all contractors to have current SWMS

Submit your SWMS documentation immediately:
{{portal_url}}

If we do not receive your SWMS documentation within 24 hours, we will need to discuss alternative arrangements for this project.

Contact us immediately if you need assistance:
📞 {{contact_phone}}
✉️ {{contact_email}}
Available Monday-Friday, 7:00 AM - 5:00 PM

Final Notice Issued by:
Bayside Builders WA
Work Safe WA Licensed Builder',
    true
);