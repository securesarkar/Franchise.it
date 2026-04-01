# Firestore Security Rules Starter

This is a starter baseline and should be hardened before production.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    function isAdmin() {
      // Starter placeholder: replace with custom claims or an admin collection check.
      return isSignedIn() && request.auth.token.admin == true;
    }

    function validRole() {
      return request.resource.data.role in ['franchisor', 'franchisee'];
    }

    match /users/{uid} {
      allow read, write: if isOwner(uid) || isAdmin();
      allow create, update: if (isOwner(uid) || isAdmin()) && validRole();
    }

    match /franchisors/{uid} {
      allow read, write: if isOwner(uid) || isAdmin();
      allow create, update: if (isOwner(uid) || isAdmin()) && request.resource.data.role == 'franchisor';
    }

    match /franchisees/{uid} {
      allow read, write: if isOwner(uid) || isAdmin();
      allow create, update: if (isOwner(uid) || isAdmin()) && request.resource.data.role == 'franchisee';
    }
  }
}
```
