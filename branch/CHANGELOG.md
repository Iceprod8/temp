# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## 2.2.0 - 2021-09-03

First public release:
* Drive Inlase machine
  - Get inlase status
  - Generate and convert cutline into ready to cut commnads
  - Send commands

* Organize production
  - Patient list / dashboard
  - Appointment
  - Label printing
  - Prepare models for printing

* Production ready
  - Scalable architecture for computing and storage
  - Unit tests
  - Quality code tests

### Added
- Unit Test *#back*
- Add machine model *#back*
- Test code with jscpd *#back*, *#front*
- Add sheet thickness *#back*, *#front*
- Add vertical option for printing model *#back*, *#front*
- Add visible cutline *#back*, *#front*
- Add appointment model *#back*
- Export models into zip files *#back*, *#front*
- Add label printing view *#front*
- Add Quota and plan *#back*
- Add Patient postal address in backend *#back*
- Integrate papercups (online chat) for support

### Changed
- Complete new dashboard *#front*
- Reformat models and aligners page *#front*
- Enable computing in lambda function (async) *#back*
- Use S3 storage middleware *#back*
- Improve file name and path when store *#back*
- Improve practitionner page *#front*
- Improve admin interface *#back*
- Change "active" step semantic, now the active step is the next or current, not-finished, step.

### Fixed
- Fix ndarray behavior (shape) by update lib *#back*

## 2.3.0 - 2021-09-30

First feedbacks integration:
* Drive InLase machine
  - Improve cutline propagation
  - Expose InLase in the frontend

* Organize production
  - Due date for steps
  - New labels page
  - Add notes
  - Start rank settings

* Production ready
  - Add frontend tests
  - Optimize tests on github
  - Improve design
  - Fix many bugs

### Added
- Frontend tests with cypress *#back*, *#front*
- Add due date in steps *#back*, *#front*
- Expose inlase machine in batches *#front*
- A start rank in steps
- A button to reset the default cutline
- Refresh protection when upload new models
- Add a fake InLase mock (for dev)
- Add machine assignation for cutting batch

### Changed
- Improve test runs on github actions *#infra*
- Update design reactiveness *#front*
- Add label page like models and aligners *#front*

### Fixed
- Fix reactive behavior on login and dashboard pages *#front*
- Fix typo
- Fix patients filtering (according to avaialble models to print)
- Fix validation of batch
- Fix crash when delete steps

## 2.3.1 - 2021-10-06

### Fixed
- When validate a cutline go to the next model
- Modify cutline clean icon
- Change "Print by hand" by "3d cutline"
- Fix step name generation
- Do not delete the period if security check is not pass
- Sort periods in dashboard according to start_date
- Refresh model after reset the cutline
- Previous steps are a step with start date before the current start date

## 2.4.0 - 2021-10-21

Production oriented interface
* Massive upload feature
  - Upload model without steps
  - Assign models to a step

* Organize & search
  - Use onshelf library for table in frontend
  - Implet sort and filter for patients with table library

* Step notes
  - Expose step notes in patients list

### Add
- Add production due date form to change it *#front*
- Add a button in dashboard to upload models without steps
- Add a button to select previously uploaded models for a step

### Changed
- Use table library for patients list *#front*
- A note body could be empty
- In patients list, replace patients notes by step notes
- A model could be have no step

## 3.0.0b1 - 2022-02-23

New production oriented interface (Pierre lead)
* Production objects (orders, setups etc...)
* New flow
* Table view to filter, modified objects

### Add
- New object Orders
- New object Setup
- New object Appointment
- Use of tables to manage objects
- 3d simulator for cutting
- Order flow (from practionner to laboratory)
- Lab task page
- Follow-up (history) features

### Changed
- Use MUI Datagrid for tables
- Enforce object permissions
- Modify login page
- Migration of three.js lib
- A lot of work on cypress test infrastructure
- Centralize all backend object manipulation through context manager
- Update orthoin3d lib
- Improve UX on cutline definitions

## 3.1.0b1 - 2022-04-20

Integrate small modification for production oriented interface.

* Improve the model uploading and cleaning process
* Add deep learning cutline process
* New (generic) lambda architecture
* Clean and add small bugs and features
* Make the production process an option
* Doctor tasks

### Add
- Generic async job architecture
- Use deep learning to compute a from scratch cutline
- Add a doctor tasks view

### Changed
- All heavy process are run asynchronously with the new lambda architecture
- Check model size at uploading
- Fix "validate order" behavior according the type
- Remove default settings options in frontend (too complicated)
- Use the right verbs for actions (cutting, printing etc...)
- Add more order types (clin check, retainer etc....)
- Remove useless button in (dashboard) forms
- Order options are now choose according to order type
- Block to large files in upload (>10MB)
- Block when no rank indication is present in filenames
- Print vertically by default
- Default appointment date is today

### Fixed
- Fix ranking when upload models
- Fix number of order in table
- Fix cutline propagation
- Do not display line in batch views when no available models
- Compute a default cutline even if no originals is present
- Refresh next appointment when create a new appointments
- Rename download to upload

## 4.0.0 - 2022-10-07
* This version is for the start of actual production
* Simplification of the interface
* Helping with end users concerns
* Finalizing bridge with real machine

### Add
- A tool "model uploader" to upload whole folder at once from the user computer.
- The tool automatize creation of patient, setup, and does pre tretament to do some fix.
- Gunicorn tool for production server
- Power setting for InLase is set and send from InPlan (no UI yet)

### Changed
- Adapt the bridge interface to work with the actual InLase
- Adapt Inlase interface in InPlan to reflect the new possible actions
- Removed the sepration between original (not needed for now) template and aligners in patient dashboard.
- Added a filter to remove big clusters of control points following the machine learning generated control line.
- Removed other orders than aligners. Other order should come in a more clear way in a future interface work
- The lower / upper sepration for aligner command is disabled until it gets improved
- Bigger holes in the based
- Reduced the size of the "ribbon" when doing the extrusion 
- Removed empty chat bot window

### Fixed
- Now, it is possible to start a new command using a model already in another command
- Fixed validation of the cutting batches
- The aligner number when doing an order is no longer blocked
- Patient can't be duplicated anymore
- Requirement version for vtk
- InLase batches can't be bigger than 6



