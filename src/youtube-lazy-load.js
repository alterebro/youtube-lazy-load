document.addEventListener("DOMContentLoaded", function() {
    
    const youtube_lazy_id = Math.random().toString(36).slice(2).substring(0, 8);
    const youtube_lazy_selector = `youtube-lazy-${youtube_lazy_id}`;
    const youtube_lazy_style = function() {

        let _youtube_lazy_css = `
            .${youtube_lazy_selector} {
                display: inline-block;
                width: 100%;
                height: auto;
                max-width: 42rem;
                aspect-ratio: 16 / 9;
                position: relative;
                text-indent: -1000rem;
                background-color: #ccc;
                background-size: cover;
                background-position: center;
                margin: 0;
                padding: 0;
                border: none;
                overflow: hidden;
            }
            a.${youtube_lazy_selector}::after {
                content: "";
                display: block;
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4.8rem;
                aspect-ratio: 1 / 1;
                transform: translate(-50%, -50%);
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3E%3Cpath fill='red' d='M13.5 3.4c.6.2 1 .6 1.2 1.2C15 5.7 15 8 15 8s0 2.3-.3 3.4a1.8 1.8 0 0 1-1.2 1.2c-1.1.3-5.5.3-5.5.3s-4.4 0-5.5-.3a1.8 1.8 0 0 1-1.2-1.2C1 10.3 1 8 1 8s0-2.3.3-3.4c.1-.6.6-1 1.2-1.2C3.6 3.1 8 3.1 8 3.1s4.4 0 5.5.3z'/%3E%3Cpath fill='%23fff' d='m10.2 8-3.6 2.1V5.9L10.2 8z'/%3E%3C/svg%3E");
                background-size: contain;
                background-position: center;
            }
        `;

        let _youtube_lazy_style = document.createElement('style');
            _youtube_lazy_style.type = 'text/css';
            _youtube_lazy_style.id = youtube_lazy_selector;
            _youtube_lazy_style.textContent = _youtube_lazy_css;

        return _youtube_lazy_style;
    }

    const youtube_thumbnail = function(id) {

        let source = `url('https://i.ytimg.com/vi/${id}/0.jpg')`;
        return source;
    }

    const youtube_lazy_iframe = function(id, title) {

        let iframe = document.createElement('iframe');
            iframe.setAttribute( 'src', `https://www.youtube-nocookie.com/embed/${id}?rel=0&controls=1&autoplay=1&mute=1` );
            iframe.setAttribute( 'title', title);
            iframe.setAttribute( 'allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" );
            iframe.setAttribute( 'referrerpolicy', "strict-origin-when-cross-origin" );
            iframe.setAttribute( 'allowfullscreen', true );

            iframe.classList.add(youtube_lazy_selector);
            iframe.style.backgroundImage = youtube_thumbnail(id);

        return iframe;
    }

    let youtube_lazed = false;
    let youtube_lazy_links = Array.from(document.querySelectorAll('[data-youtube-lazy]'));
        youtube_lazy_links.forEach(function(el, i) {

            let youtube_regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/gm;
            let matches = youtube_regex.exec(el.href);

            if ( matches && matches[6] ) {

                if ( !youtube_lazed ) {

                    document.head.appendChild(youtube_lazy_style());
                    youtube_lazed = true;
                }

                let youtube_id = matches[6];
                el.classList.add(youtube_lazy_selector);
                el.dataset.youtubeId = youtube_id;
                el.addEventListener('click', function(ev) {

                    let iframe = youtube_lazy_iframe(youtube_id, el.textContent);
                    let parent = el.parentNode;
                        parent.replaceChild(iframe, el);

                    ev.preventDefault();
                })
            }

        });

    // Intersection Observer
    let youtube_lazed_links = Array.from(document.querySelectorAll(`.${youtube_lazy_selector}`));
    if ("IntersectionObserver" in window) {

        let lazy_background_observer = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {

                    entry.target.style.backgroundImage = youtube_thumbnail(entry.target.dataset.youtubeId);
                    lazy_background_observer.unobserve(entry.target);
                }
            });
        });

        youtube_lazed_links.forEach(function(lazy_background) {
            lazy_background_observer.observe(lazy_background);
        });
    }

});