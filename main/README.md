# InPlan

## Table of contents
* [Introduction](#introduction)
* [Technologies](#technologies)
* [Launch](#launch)
* [Delivery](#delivery)

## Introduction
ORTHOiN3D is a Saas software which organizes and optimizes
the production of your In-Office aligners.

The project is split into 2 parts, backend (API) and frontend (web UI).

## Technologies

* Django
* Django Rest Framework
* AWS Lambda
* AWS S3
* STL libs (meshlib, stl numpy, vtk, pyvista)
* Javascript React
* 3D webgl lib Three.js

## Launch

* backend: `python manage.py runserver`
* frontend: `yarn start`

Check backend/frontend README for more details.


## Delivery
The main steps to deliver a new version.

### Prerequies
0. You must have aws cli installed on your computer and properly configured.
0. Your AWS credentials must give all the needed rights on AWS services.
0. You must have a properly configured docker daemon

### Source preparation
1. Clean all git branches (to avoid forgetting one)
2. Wait and check all github actions of InPlan projects. The tests must be green
3. Merge all last (green) branches (do not hesitate to re-run failed jobs if red,
   it seems to have sometimes negative falses).
4. Run locally tests on main
5. Modify version in backend and frontend
   * ```backend/orthoinback/__init__.py```
   * ```frontend/package.json```
6. Verify the orthoin3dlib dependency in ```backend/requirements-orthoin3d.txt```
7. Commit (on main) the version update
8. Tag the new version (with the current version) ```git tag 3.1.0b1```
   and then push it ```git push --tags```

### Deploy backend
9. Go to the backend EC2 machine (ssh)
10. Verify if no local change, if exists, integrate it, increment version and loop to 5.
11. Update the main branch
12. Apply migrations ```DJANGO_SETTINGS_MODULE=orthoinback.settings_preprod python manage.py migrate```
13. Verify if server running, if not, run
    ```DJANGO_SETTINGS_MODULE=orthoinback.settings_preprod python manage.py runserver 127.0.0.1:8001```
    detach the process (currently use screen for preprod).

### Deploy frontend
14. On the personnal computer, go to ```frontend``` directory and run  ````yarn deploy```, this process upload a compiled
    version in s3.
15. Go to the AWS admin console, go to the cloudfront service and select the ```EW4WUSW6FL1CO``` distribution
    Go to the invalidations panel, copy the last one (invalidate all files), wait the end.

### Deploy lambda
16. In ```backend``` directory, run ```python manage.py deployLambda``` (```--help``` for mode details).
    It will:
    * create a docker container
    * log in AWS ECR service, upload the container
    * and update the lambda service with the last version
17. Wait the lambda function update (it can take up to 5 minutes).
