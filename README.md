# Ben Caro - Portfolio

## Overview

This form is a project developed to create a full-stack application with Next.js

## Technologies Used

- **Front-end**: Next.js, React, TypeScript, SCSS, Redux, Yarn
- **Back-end**: Next.js, GraphQL
- **Database**: Postgres
- **Hosting**: AWS Amplify and Amazon RDS

## Users

The "admin" account is username: `admin` and password `secretpassword`

Regular users can be created at the landing page!

## Retrospective

The goal was to complete this in a few days. I chose GraphQL with Relay for their powerful batching and speed. I think this is still a viable choice but conflicts with a lot of changes that came with Next.js v13. It seems that the context heavy reliant nature of a framework like relay fights against the SSR nature of Next.js, this could still be worth the trade-off if the part of the site is really data fetching heavy, especially if your back-end isn't "close" to the data.

This was my second project in Next and definitely enjoy the goals and highly opinionated structure Next forces you into, I can see how this leads to consistency across team-members and teams. This also needs consideration and learning how to best conform so that you take advantage of all that Next has to offer, while avoiding fighting against it.

Also utilizing postgres I need to get better at relational queries to make my life easier.

## Contact

- **Website**: [www.ben-caro.com](https://www.ben-caro.com)
- **Email**: bccaro8@gmail.com
- **LinkedIn**: [Ben Caro](https://www.linkedin.com/in/benjamin-c-caro/)
