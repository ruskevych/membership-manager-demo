# Membership Management System

## Getting Started

This project is a backend system for managing memberships and membership periods, built with Express.js and TypeScript.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher recommended)

### Installation

Install all dependencies:
```sh
npm install
```

### Running the Project

To start the server:
```sh
npm run start
```

For development with automatic reload:
```sh
npm run dev
```

### Running Tests

To execute the test suite:
```sh
npm run test
```

### Project Structure
- `src/` - Source code
- `src/data/` - Mocked JSON data for memberships and periods
- `src/modern/` - Modernized TypeScript codebase
- `src/legacy/` - Legacy JavaScript codebase

### Useful Scripts
- `npm run build` - Compile TypeScript
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

---

## Architecture Diagram (Task 2)

You can view the architecture diagram for the asynchronous membership export process here:

[Membership Export Architecture Diagram](https://viewer.diagrams.net/index.html?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=Untitled%20Diagram.drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22Page-1%22%20id%3D%22e01rEyMjg1d6C2L8W_ZL%22%3E7ZxZc%2BI4EIB%2FTR6hfGJ4HEjmqqQmCbOz2X3ZElixNWMsrywCzK9fyZYwlkwwBAzZciqVWG35oPWp1YeSK3s0W34iIAnvsA%2BjK8vwl1f29ZVlWZ7psF9cshISwzNySUCQn8vMQjBGv6EQym5z5MO01JFiHFGUlIVTHMdwSksyQAhelLs946j81AQEUBOMpyDSpX8in4a5tO8ahfwzREEon2wa4swMyM5CkIbAx4sNkX1zZY8IxjQ%2Fmi1HMOLak3rJr%2Fu45ez6xQiMaZ0LiPP0cfTjfvL9AVP85Wmc%2FOonHXGXFxDNxQcejX%2Fw8cKLOMLAF69OV1If6QLNIhCz1vAZx3QszhisPQ1R5N%2BCFZ7z90kpmP6SrWGICfrN%2BoOInTKZgJ0mVAy3bZR6jPmV4p4EpqzPvfyQpiK6A8tSx1uQUvk2OIpAkqJJ9n78whkgAYqHmFI8E50WIaJwnIAp77NgCPMXoTP5krqKpb4goXC5IRIq%2FwTxDFKyYl3E2Y4px1%2FMgI4r0V4UPJmOkIWbLPWFEAiGg%2FXd1w98ZMyDOGCfcf1Eu%2Fw8q%2BJpVsXTbOVhIKKQxIDCIZ7HfrqJFjvY%2BKiFKANuD%2Fg8DT6kA8f0TDNeCP4FRzjChMljnBOIokgRgQgFMWtG8JlfxgcKsdn8QYhnyPf5nYcpG3QUB7dZt2unkDwKlXARZpc%2FR9mkDdmFkN1hmGAU00xH7pB9M62NjK575bJ3HbG2WbTZN%2B9O6AjH7PUByiCCDNEF5JgOCaaAgsl6Au1N46tTejeiq%2FLI7%2BJRJWQTxxIa%2B3JgaRzMU0i%2BtCw0z0Lv3CzYGgs%2Bs0EfCTPZLQ1N0zA4Nw1OJQ3fcctC4yyYVY5EozD0dHchnkZzn%2Fs%2BCSQICy%2Bl5aJRLtxzczHQuHiEPmIs9CKupwlhRwE%2F%2BjADLMJgXW8ipkY0AtMQ6gFOCBJ%2BOF1FKPYhsXerdsI9ZOjfTtYCFsAEhEu%2FzSm7jYxA0jzeMd3jxBZWXwktKsfC3De0eNNgmLozd7PkGDPZVzxhPx%2FmkJ2xemDG1RhP0mStjTbOPGKcaTk1J%2BbgZCzoy%2FcfCV%2FAs6EGdN7a67fba6s2KZcS7pm6j38%2FT0Mm%2BZkZCMrcO%2BMRTCaI3j20hDRPyNmDQFN39TQOYOx%2F4PldvlSz5TxF07J2SL4oC1UyFZHVE290DdORgr8ygWWtBdfLzf7Xq83WPXMx2ceDRAqXiD6Jh%2FHj%2FGauaBV34g15o62GPsVzMoU1bClbzgL42nALbwj6pby2PtYbg%2BtWjK2UERgBil7K2fBXEpL3fDoUy5LpuaVVSUUm%2F9zios3ktXIf9kLK6qbcKNeLdqNjpSpNPVd5PCLdEo87WHwDQjUJkgbjQhCyBt3BxpfrKCS4xoFMdWynO%2BgZxZfdU9xpr9c17EY5s%2Fs6VmwYpPvLFo8QBzgG0U0hVcAq%2BtxinAj2fkJKV8INBnO2wpbIrDZl3uu27AwA92sSLO%2B4k%2BDaaL5tOetrxuPfPAgypukL%2BxnAGBJAMdknLGogpnB6SkxR4RlYRsXU7x3BM%2FA%2Ff%2FtnBZD38DcJ06%2FLb9bLl2lFqWAd1Le%2B4hF8xX5tRmR50a1HxOkKBoPWYm4fz0Fdi2lflsXUc3rSYs4A4penkCfnLsw%2Bmme3j3po3drHY9rHQW1Gtm%2B%2FaNY%2BrrFWt%2FhsOB1nnUSmsmGlU5W39CpUZp5OZ7r5%2BZRri1sgEPuZvjDhrUyZ7bx627zaA5vtfkclJKfzO%2FR51WYxL4mQqixms4TowUpb%2Fjg7FusNumfjwtKdtLsLcmrV9XhdZd65Hqs52ePNJF1j7Uw69kyya5MiwPBqcuGeCgvpKFa4aWnhp8Fs97IB88CxxaRpTKrqzVWYOCezt8evJh5Q%2BiuSP6XUT5EJ2qf2uNXO78wISafkndURvfKaZKp7VurWfEyv3zXsjXKSUvKx%2Bl3PLc56Paf8nBOXfyy9UnBBqPZtu2FY7XcJq9WzSlTZA%2BswWm0lv2ir2J%2B6Gunq9DWXWzcOQrZrNZRblwmA3fX0unQ2k1uXVe7LH9TDx8asazhkwetCxsbRk0pnsP%2BH610mTnfq3XEuy2Ir7oV3oHvRUf%2F60lE3Wp%2FYYjv6lts828%2FT1fxPnbdvih%2FbGmrveC%2B8WRV2VG6FV8f6eJPZ1cZiDLOYVMSiBljoiYvzVjDtiqC%2B2QqmDnBB6M1YU1cbwO8ZwK%2BpfD8lTOfdeCzN7%2FCQWZPdK657Lk%2BncprrtvFYjk7XMN3SkFle%2F%2FVBYw1tc%2FdlZGvqj%2B5l%2BVOOq7hBammgrkPlqMu6utn3eP5UJaam7pAnOKUByTLMMzibwDREyf%2FJc%2Bo4VQWfnqvDYh3jrwir1W6dzDycLQ56la8LmbfqfjbzwGm7vlCpxb951rJm8R%2BT8u7FP56yb%2F4D%3C%2Fdiagram%3E%3C%2Fmxfile%3E#%7B%22pageId%22%3A%22e01rEyMjg1d6C2L8W_ZL%22%7D)
