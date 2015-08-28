
if (Meteor.isClient) {

    disqus_identifier = null;
    disqus_title = null;
    disqus_url = null;

    Template.disqus.helpers({
        'is_configurated' : function () {
            return !!disqus_shortname;
        }
    });

    Template.disqus.rendered = function () {
        var templateData;

        templateData = this.data;
        Session.set('disqus.settings', templateData);

        if (window.DISQUS) {
          if (!templateData.url || !templateData.identifier || !templateData.title) {
              return;
          }
            DISQUS.reset({
                reload : true,
                config : function() {
                    this.page.identifier = templateData.identifier;
                    this.page.url = templateData.url;

                    if (templateData.title) this.page.title = templateData.title;
                    if (templateData.category_id) this.page.category_id = parseInt(templateData.category_id, 10);
                }
            });
        } else {
            Session.set('disqus.firstinit', true);
        }

    }

    Deps.autorun(function(){
        if (Session.get('disqus.firstinit') && !window.DISQUS && disqus_shortname) {

            var settings;

            settings = Session.get('disqus.settings');

            if (!settings.identifier || !settings.url || !settings.title) {
                return
            }

            Session.set('disqus.firstinit', false);
            disqus_identifier = settings.identifier;
            disqus_url = settings.url;
            disqus_title = settings.title;

            (function() {
                var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
            })();
        }
    });
}
