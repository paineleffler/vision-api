# IMPORTANT!!!
## YOU NEED A TWITTER API KEY IN .ENV, use .ENV.EXAMPLE as reference

# ALSO IMPORTANT!!!
## INSTAGRAM-SCREEN-SCRAPE is BROKEN!!!
### You need to fix this dependency by adding a case statement in the /lib/posts.js
```javascript
  /////// post type switch statement
  case 'carousel':
    post.media = rawPost.images['standard_resolution'].url;
    break;
```

## IF YOU NEED HELP FINDING THIS ASK ME!