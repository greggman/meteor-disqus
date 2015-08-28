# Reactive Disqus Template

![Meteor logo](https://d14jjfgstdxsoz.cloudfront.net/meteor-logo.png)

This is a modification of the visudare:disqus package.

## Why

Both the [visudare:disqus](http://atmospherejs.com/visudare/disqus) package and the [obvio171:disqus](https://atmospherejs.com/obvio171/disqus) package had issues for me.

### Issue #1. Can not easily use during testing/staging

Disqus can use ids to decide which thread to display. Absent ids
it goes by the URL of the page. You'be smart to use ids because it lets you
change the URL later and/or use the same discussion on mutliple pages. So,
if you reorganize your website, as long as the ids stay the same you won't
lose your discussions.

The problem is when you're testing that id will become associated with
the wrong URL. Disqus records the URL you pass in or uses the current
page location if not provided. So what happens is you test on your
local machine or a staging server. Some discussions id=123 becomes
associated with a url like `http://localhost:300/blog/somearticle` or
`http://staging.yourblog.com/blog/somearticle`

Everything appears to be fine until someone receives an email about
a reply they left on your disqus thread. When they click the link in
the email to take them back to the disqus thread they are sent to
that first link. As in the *WRONG* link.

There are 2 ways around this.

1.  Make disqus not function if not on your production server.

    I've used this method on non-meteor blogs.

2.  Always set the disqus URL parameter.

    Using the standard routing you can do something like this

        Template.someTemplate.helpers({
          disqusPath: function() {
            // Generete the same route URL
            var path = "http://yourblog.com/blog/" + this._id;
            return path;
          },
        });

    And then in your template

        {{> disqus url=disqusPath identifier=_id }}

    This would work except ... see below

### Issue #2

Meteor has interesting intermediate states. What I found is that
meteor would execute the disqus template with the correct id
but the wrong location. I didn't bother to look but I'm guessing
what happens is meteor first re-renders the page then updates
the URL with `history.pushState`

The code in the previous package set the disqus URL something like

    disqus_url = userset.url || window.location.href

This had the effect that the id would be set but the URL would
be wrong. I'd see that some id was assoicated with the root of my
blog instead of a specific path.

### Solution

My solution, which maybe I just missed something but hey it works for me,
is that I require a user set url, id (and for good measure a title). If
they are not set then I don't let the code ping disqus. This avoids
creating bad threads on disqus when meteor is in its intermediate
states.

You can check your thread url/id/title on disqus at `https://username.disqus.com/admin/discussions/`
to make sure it's working. Unfortunately while you can manually fix wrong entries you can
not delete any of them.

## How to

**Add the Meteor Package**

`meteor add greggman:disqus`

**Configure disqus shortname**

Set your Disqus shortname in `/lib/somefile.js`

`disqus_shortname="your_shortname";`

**Add the Disqus Template wherever you want**

`{{> disqus url=someUrl title=someTitle identifier=someId }}`

**Template Settings**

You can set the following options to the template:

1. url (not optional)
2. category_id
3. identifier (not optional)
4. title (not optional)

**Example:**

In meteor clientside javascript

    Template.someTemplate.helpers({
      disqusPath: function() {
        // Generete the same route URL
        var path = "http://yourblog.com/blog/" + this._id;
        return path;
      },
    });

Then in some template

    {{> disqus url=disqusPath id=_id title=title }}

Where `_id` is whatever you want to use as a unique and unchanging
id for the thread from the current context and `title` is whatever
title you want to use for the thread from the current context.

**Reference here:** 

<https://help.disqus.com/customer/portal/articles/472098-javascript-configuration-variables>
