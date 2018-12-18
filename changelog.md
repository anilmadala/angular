Version V2.2.6
==========================

Fixes
1. RFA sprint 1 fixes

Version V2.2.5
==========================

Fixes
1. IE compatibility and RFA sprint 1 fix


Version V2.2.4
==========================

Fixes
1. Staging mongo connectivity fix

Version V2.2.3
==========================

Fixes
1. IE compatibility fixes

Version V2.2.2
==========================

Fixes
1. IE compatibility fixes


Version V2.2.1
==========================

Fixes
1. RFA fixes


Version V2.2
==========================

Features
1. Added new Diagnoses ICD 10 codes.
2. Added static link for Diagnoses ICD 10 codes reference, on all diagnoses pages
3. Menus inserted for Inclinometer and Goniometer pages


Version V2.1.020
==========================

Features
1. Added Goniometer menu link and linked the goniometer page.


Version V2.1.019
==========================

Features
1. Diagnoses upload for upper and lower extremity body parts publish (DFR, PR2 and PR4)


Version V2.1.018
==========================

Features
1. Diagnoses upload for cerivcal body parts publish (DFR, PR2 and PR4)

Version V2.1.017
==========================

Features
1. Diagnoses New Form template for all body parts except Toes
2. Diagnoses static link for ICD codes reference
3. Adding of Inclinometer link

Version V2.1.016
==========================

Features
1. Authorize.net Transaction ID update

Fixes
1. RFA fixes

Version V2.1.013
==========================

Features
1. RFA feature

Fixes
1. RFA fixes


Version V2.1.012
==========================

Bug Fixes
1. Added routing for youtube verification file


Version V2.1.011
==========================

Bug Fixes
1. Made CC transaction server side
2. Added options to mongoose connection

Features
1. Uploaded youtube verification file


Version V2.1.010
==========================

Features
1. Added new join today page

Version V2.1.009
==========================

Bug Fixes
1. Removed the waiting time of 2 mins between two CC transaction.


Version V2.1.008
==========================

Features
1. Changed the terms_to_use.pdf file

Bug Fixes
1. Bug Fixed of report data encryption - Background Information and Injured Body systems.
2. Login Freeze issue fix - connect-mongo updated from 0.5.3 to 0.8.2
3. Feedback Fixes - (#Importing-Injuries02, #import-company) 

Version V2.1.007
==========================

Bug Fixes
1. Redirect issue in safari - "rate-fast.com/classic" to "planetpr4.com"
2. Change the link "Blogs" to "Blog" in header and also set the "target='_blank'"
3. Feedback Fixes - (#app-siteadminuser01) 
4. Injuries error fix - Unaught exception: TypeError: Cannot read property 'injury' of null at Promise.<anonymous> (D:\home\site\wwwroot\lib\controllers\injuries.js:176:39


Version V2.1.006
==========================

Bug Fixes
1. Google Analytics 
2. Feedback Fixes (#website-testimonials) 

Version V2.1.005
==========================

Features
1. Added Google Analytics code
2. Add redirect URL to PHP v1.3. From (https://rate-fast.com/classic) to (https://planetpr4.com) 

Version V2.1.004
==========================

Bug Fixes
1. Feedback Workbook - (#Report Library Sheet - Ensure that the Patient Name and other data displays correctly on the Injury/Report library screen)
2. Internal Bug Fix - Report Archive Popup (Firefox browser), Autologout message Fix
3. Feedback Workbook - (#reportmenus-safariSavePopup, #reportlibrary-displaydata01, #blog-toplink01,#app-autologoutpopupremain, #pr2publish-limb02, #pr4-autopaindrop)
4. Reconnect database after Mongolob maintenance(server.js File)  

Features
1. Send email alert on 'sales@rate-fast.com' on new user Sign Up on production site. Send email alert on 'rate.fast1@gmail.com' on new user Sign Up on staging site.
2. Update the Mongoose modules to 3.6.17


Version V2.1.003
==========================

Bug Fixes
1. Feedback Workbook - Ensure that Level 2 users can see the "Social History" page(#DRF Menus)
2. Add the text "Failure to complete all measurements will result in an INVALID impairment rating." in red font at the end of the ROM table for all body parts
3. Confirm password validation resolution(#Website-11).
4. Ensure that the "Therapy" and "Injections" and "Referral to specialty" sections publish if "Is referral to therapy necessary today?" == "No"
5. Fixed loading of Twitter Feeds(Mac Firefox Pending)
6. Issues from Feedback(#Importing-Injuries01, "#PR4menus-impratswitchsave01, #reportlibrary-displaydata01)
7. Form, report, template designer pagination and search fixes

Features
1. Remove the "Save to DocX" button for "Rater" and "siteadmin" type users when they view the "Preview/View" screen
2. Prevent the "Rater" and "siteadmin" type users from copying and pasting text from the "Preview/View" screen
3. Remove the text "- Conversational Flavor A" from report preview header
4. Changed "D.C.M" to "D.C." all over the application(#Website-10)
5. Error Logging on Sign Up in "log" folder
6. Change in the Website Home Page as per https://www.dropbox.com/s/9uj0p12ykx641qr/2015.06.29_v2_new-website-copy.docx?dl=0
7. Removed the "State Selection" screen from the Website Pricing Page


=========================================================================================================

Version V2.1.002
==========================

Bug Fixes
1. Feedback Workbook - (#PR4 Menus-08)

Features
1. Alert messages sent to users after PR4 reports ratings are complete
2. Give business users a Credit Card report showing their billing history
3. HIPAA – User Activity Section
4. HIPAA – Lock user after failed login attempts
5. Global Pricing Feature
6. PR-2 import from PR-4

