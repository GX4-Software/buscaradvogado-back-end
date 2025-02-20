export const MagicLinkTemplate = /* html */ `

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #007BFF; /* Company primary color */
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            font-size: 16px;
            color: #ffffff;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Authentication Required</h1>
        </div>
        <div class="content">
            <p>Hello {{userName}},</p>
            <p>Please click the button below to authenticate your account and access the requested resource:</p>
            <a href="{{magicLink}}" class="button">Access Now</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>Company Name</p>
        </div>
    </div>
</body>
</html>


`