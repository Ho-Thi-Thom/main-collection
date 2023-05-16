import collectionService from "./service"
const { loading, createUrl, hiddenLoading, getApi, appendProduct, setProduct, updateCount, updateShowing, updatePointInfinity, updatePaginate, createUrlFilter, updateUrl } = collectionService()

export function infinity(infinityPoint) {
    if (infinityPoint) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const url = target.dataset.url;
                    const sectionId = target.dataset.sectionId;

                    try {
                        function callback(searchParams) {
                            searchParams.set('section_id', sectionId);
                        }

                        const _url = url ? createUrl(callback, url.split('?')[1]) : null;
                        if (_url == null) {
                            observer.disconnect();
                            return;
                        }
                        loading(target);
                        getApi(_url)
                            .then((data) => {
                                const infinityPoint = data.getElementPointInfinity();
                                appendProduct(data.getElementProduct());
                                updatePointInfinity(infinityPoint, infinity);
                                updateShowing(data.getElementShowing());
                            })
                            .finally(() => {
                                hiddenLoading(target);
                            });
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        });
        observer.observe(infinityPoint);
    }
}


export function sortBy(element) {
    if (element) {
        element.addEventListener("change", event => {
            const value = event.target.value;
            const sectionId = event.target.dataset.sectionId

            function callback(searchParams) {
                searchParams.set('sort_by', value)
            }
            let url = createUrl(callback, window.location.href.split('?')[1])
            history.pushState(null, null, url);
            url = updateUrl(url, sectionId);
            getApi(url).then((data) => {
                setProduct(data.getElementProduct())
                updatePointInfinity(data.getElementPointInfinity(), infinity)
                updateShowing(data.getElementShowing())

            })
        })
    }
}


export function show(showElement) {
    if (showElement) {
        showElement.addEventListener("change", (event) => {
            const value = event.target.value;
            const sectionId = event.target.dataset.sectionId
            const url = `${window.Shopify.routes.root}cart/update.js`;
            const data = {
                attributes: {
                    items_per_page: value
                },
                sections: [sectionId],
                section_url: location.pathname + location.search
            };
            const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            getApi(url, options).then(() => {
                let collectionUrl = location.pathname;
                collectionUrl += location.search;
                collectionUrl += location.search.includes('?') ? '&' : '?';
                collectionUrl += 'section_id=' + sectionId;

                getApi(collectionUrl).then(data => {
                    setProduct(data.getElementProduct())
                    updatePointInfinity(data.getElementPointInfinity(), infinity)
                    updatePaginate(data.getPaginate(), paginate)
                    updateShowing(data.getElementShowing())

                })
            })
        })
    }
}


export async function filterForm(filterForms) {
    if (filterForms) {
        filterForms.forEach(input => {
            input.addEventListener('change', async (event) => {
                const value = event.target.value;
                const name = event.target.name;
                const sectionId = event.target.dataset.sectionId;
                try {
                    function callback(checkedValues) {
                        if (event.target.checked) {
                            if (!checkedValues[name]) {
                                checkedValues[name] = [];
                            }
                            checkedValues[name].push(value);
                        } else {
                            if (checkedValues[name]) {
                                checkedValues[name] = checkedValues[name].filter(val => val !== value);
                            }
                        }
                    }

                    let url = createUrlFilter(callback, window.location.search);
                    history.pushState(null, null, url);
                    url = updateUrl(url, sectionId);
                    const data = await getApi(url);
                    setProduct(data.getElementProduct());
                    updateCount(data.getProductCount());
                    updatePaginate(data.getPaginate(), paginate);
                    updateShowing(data.getElementShowing());
                    updatePointInfinity(data.getElementPointInfinity(), infinity);
                } catch (error) {
                    console.error(error);
                }
            });
        });
    }
}

export function filterPrice(filterPriceElement) {
    if (filterPriceElement) {
        const params = { 'filter.v.price.gte': 0, 'filter.v.price.lte': Number.MAX_SAFE_INTEGER };
        filterPriceElement.forEach(input => {
            input.addEventListener('change', (event) => {
                const value = event.target.value;
                const name = event.target.name;
                const max = event.target.dataset.max;
                const sectionId = event.target.dataset.sectionId;
                params['filter.v.price.lte'] = max;
                params[name] = value;

                try {
                    function callback(checkedValues) {
                        for (const key in params) {
                            checkedValues[key] = [];
                            checkedValues[key].push(params[key]);
                        }
                    }

                    const url = createUrlFilter(callback, window.location.search);
                    history.pushState(null, null, url);
                    const updatedUrl = updateUrl(url, sectionId);

                    getApi(updatedUrl)
                        .then((data) => {
                            setProduct(data.getElementProduct());
                            updateCount(data.getProductCount());
                            updatePointInfinity(data.getElementPointInfinity(), infinity);
                            updatePaginate(data.getPaginate(), paginate);
                            updateShowing(data.getElementShowing());
                        });
                } catch (error) {
                    console.error(error);
                }
            });
        });
    }
}




export function paginate(paginateLinks) {
    if (paginateLinks) {
        paginateLinks.forEach(paginateLink => {
            paginateLink.addEventListener("click", event => {
                const target = event.currentTarget
                const url = target.dataset.url
                const sectionId = target.dataset.sectionId

                function callback(searchParams) {
                    searchParams.set('section_id', sectionId)
                }
                const _url = createUrl(callback, url.split('?')[1])
                getApi(_url).then((data) => {
                    setProduct(data.getElementProduct());
                    updatePaginate(data.getPaginate(), paginate)
                    updateShowing(data.getElementShowing())
                    // remove listener
                })
            })
        })
    }
}



