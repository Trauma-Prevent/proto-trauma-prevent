L'application se base sur https://pub.dev/packages/card_settings#-example-tab-

# Dependencies

- android studio
- xcode
- flutter sdk
- flutter plugin for android studio

# Quick start

```
git clone https://github.com/guillaumefe/proto-trauma-prevent.git
load flutter plugin in android studio
load simulator (ios or android)
import proto-trauma-prevent into android
build // launch the app
```

# What you'll get

- a flutter starting point app
- a few questions displayed

# What has to be done

- Database connection
```
1. import http module
2. create nodejs or flask api server to works with db (legacy code may be used, see branch Master)
3. connect app to api server
4. when save button is clicked, data should be transfered to the server
```

- Adapt views

```
- in the upper right corner, add an icon to see privacies policy page
- in question "accept privacies policy", add link to privacies policy page
...
- in the upper right corner remove existing "saved" icon
...
- in the upper right corner add a member area :
should be a view that permit :
- edition of last data submission
- review and edition of previous data submission
- when a data submission is edited : 
  - new data should be added to db
  - old data should be removed from db
  - a counter may exists to keep track of the number of edition in a set of data submission
  - a set of data sumission is data added for 1 day
...
- add notification system to ask user to relaunch app and answer questions again, on a periodical basis
...
- add user login system with, ideally, separate db (GDPR compliance)
```
