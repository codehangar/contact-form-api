# contact-form-api

[![Build Status](https://travis-ci.org/codehangar/contact-form-api.svg?branch=master)](https://travis-ci.org/codehangar/contact-form-api)

A simple API to receive and handle contact form posts

To test locally, be sure to include a file names `.env` in the root of the project with the following settings:

```
SIGNUP_LOCATION=your_location.com

SLACK_WEBHOOK={{secret}}
SLACK_USER=Slack User Name
SLACK_CHANNEL=#contact-form

POSTMARK_TOKEN={{secret}}
POSTMARK_FROM={{email}}
POSTMARK_TO={{email}}
POSTMARK_TEMPLATE_ID={{Postmark Template ID}}
```

Bootstrapped with `https://github.com/trwalker/generator-express-rest-api`
