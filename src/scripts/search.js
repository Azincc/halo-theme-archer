// special thanks to https://blog.naaln.com/2016/07/hexo-with-algolia/
import algoliasearch from 'https://esm.sh/algoliasearch@4.24.0/lite';
import instantsearch from 'https://esm.sh/instantsearch.js@4.73.2';
import archerUtil from './util.js';

const widgets = instantsearch.widgets || {};
const { configure, searchBox, hits, stats, pagination } = widgets;

const initAlgolia = () => {
    document.addEventListener('DOMContentLoaded', function () {
        if (!configure || !searchBox || !hits || !stats || !pagination) {
            console.error('InstantSearch widgets failed to load. Please check CDN availability.');
            return;
        }
        const algoliaSettings = window.algolia;
        const isAlgoliaSettingsValid =
            algoliaSettings.applicationID && algoliaSettings.apiKey && algoliaSettings.indexName;

        if (!isAlgoliaSettingsValid) {
            window.console.error(
                'Algolia Settings are invalid. Please check your theme configuration.',
            );
            return;
        }

        const searchClient = algoliasearch(algoliaSettings.applicationID, algoliaSettings.apiKey);

        const search = instantsearch({
            indexName: algoliaSettings.indexName,
            searchClient,
            searchFunction: (helper) => {
                const searchInput = document.querySelector('#algolia-search-input input');

                const container = document.querySelector('.algolia-results');
                container.style.display = helper.state.query === '' ? 'none' : '';

                if (searchInput.value) {
                    helper.search();
                }
            },
            stalledSearchDelay: 500,
        });

        // Registering Widgets
        search.addWidgets([
            configure({
                hitsPerPage: algoliaSettings.hits.per_page || 10,
            }),
            searchBox({
                container: '#algolia-search-input',
                placeholder: algoliaSettings.labels.input_placeholder,
                showSubmit: false,
                showReset: false,
                showLoadingIndicator: false,
            }),
            hits({
                container: '#algolia-hits',
                transformItems: (items, { results }) => {
                    if (results.query === '') return [];
                    return items;
                },
                templates: {
                    item: (data, { html, components }) => {
                        const link = data.permalink ? data.permalink : siteMeta.root + data.path;
                        return html`
                            <a href="${link}" class="algolia-hit-item-link">
                                ${components.Highlight({
                            attribute: 'title',
                            hit: data,
                            highlightedTagName: 'em',
                        })}
                            </a>
                        `;
                    },
                    empty: ({ query }, { html }) => {
                        if (query === '') return null;

                        return html`
                            <div class="algolia-hit-empty-inner-container">
                                <i class="fas fa-drafting-compass fa-10x"></i>
                                <div class="algolia-hit-empty-label">
                                    ${algoliaSettings.labels.hits_empty.replace(/\${query}/, query)}
                                </div>
                            </div>
                        `;
                    },
                },
                cssClasses: {
                    item: 'algolia-hit-item',
                    list: 'algolia-hit-list',
                    root: 'algolia-hit',
                    emptyRoot: 'algolia-hit-empty',
                },
            }),
            stats({
                container: '#algolia-stats',
                templates: {
                    text: (data, { html }) => {
                        const stats = algoliaSettings.labels.hits_stats
                            .replace(/\$\{hits\}/, data.nbHits)
                            .replace(/\$\{time\}/, data.processingTimeMS);
                        return html`
                            ${stats}
                            <span class="algolia-powered">
                                <img src="${siteMeta.root}assets/algolia_logo.svg" alt="Algolia" />
                            </span>
                        `;
                    },
                },
                cssClasses: {
                    root: 'algolia-stat-root',
                },
            }),
            pagination({
                container: '#algolia-pagination',
                scrollTo: false,
                templates: {
                    first: (_, { html }) => html`
                        <span><i class="fa fa-angle-double-left"></i></span>
                    `,
                    last: (_, { html }) => html`
                        <span><i class="fa fa-angle-double-right"></i></span>
                    `,
                    previous: (_, { html }) => html`
                        <span><i class="fa fa-angle-left"></i></span>
                    `,
                    next: (_, { html }) => html`<span><i class="fa fa-angle-right"></i></span`,
                },
            }),
        ]);

        search.start();

        const hidePopup = () => {
            document.querySelectorAll('.ais-SearchBox-form').forEach((form) => form.reset());
            document.querySelector('.popup').style.display = 'none';
            document.querySelector('.algolia-pop-overlay')?.remove();
            document.body.style.overflow = '';
            archerUtil.stopBodyScroll(false);
        };

        const popupTrigger = document.querySelector('.popup-trigger');
        if (popupTrigger) {
            popupTrigger.addEventListener('click', function (e) {
                e.stopPropagation();
                const overlay = document.createElement('div');
                overlay.className = 'search-popup-overlay algolia-pop-overlay';
                document.body.prepend(overlay);
                document.body.style.overflow = 'hidden';

                const popup = document.querySelector('.popup');
                if (popup) {
                    popup.style.display = popup.style.display === 'none' || !popup.style.display ? 'block' : 'none';
                }

                document.querySelector('#algolia-search-input input')?.focus();
                archerUtil.stopBodyScroll(true);

                overlay.addEventListener('click', function () {
                    hidePopup();
                });
            });
        }

        document.querySelector('.popup-btn-close')?.addEventListener('click', function () {
            hidePopup();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                hidePopup();
            }
        });

        document.querySelector('.site-search')?.classList.remove('site-search-loading');
    });
};

initAlgolia();
