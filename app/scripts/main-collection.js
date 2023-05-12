import collectionService from "./service"


const infinityPoint = document.querySelector('#infinity_point')
const sortBy = document.querySelector('#sort_by')
const show = document.querySelector('#show')
const filterForms = document.querySelectorAll('input[type="checkbox"]')
const filterPrice = document.querySelectorAll('input[type="number"]')
const paginateLinks = document.querySelectorAll('.paginate_link[data-url]')
const showing = document.querySelector('.collection__toolbar-filter-showing')

const { loading, createUrl, hiddenLoading, getApi, appendProduct, setProduct, updateCount, updateShowing, updatePointInfinity, updatePaginate, createUrlFilter } = collectionService()

console.log(2)
infinityFuc(infinityPoint)

function infinityFuc(infinityPoint) {
    if (infinityPoint) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target
                    const url = target.dataset.url
                    const sectionId = target.dataset.sectionId

                    function callback(searchParams) {
                        searchParams.set('section_id', sectionId)
                    }

                    const _url = url ? createUrl(callback, url.split('?')[1]) : null
                    if (_url == null) {
                        observer.disconnect();
                        return;
                    }
                    loading(target);
                    getApi(_url)
                        .then((data) => {
                            const infinityPoint = data.getElementPointInfinity()
                            appendProduct(data.getElementProduct())
                            updatePointInfinity(infinityPoint, infinityFuc)
                            updateShowing(data.getElementShowing())
                        }).finally(() => {
                            hiddenLoading(target);
                        })
                }
            })
        })
        observer.observe(infinityPoint)
    }
}

if (sortBy) {
    sortBy.addEventListener("change", (event) => {
        const value = event.target.value;
        const sectionId = event.target.dataset.sectionId

        function callback(searchParams) {
            searchParams.set('sort_by', value)
        }
        let url = createUrl(callback, window.location.href.split('?')[1])
        history.pushState(null, null, url);

        url += url.includes('?') ? '&' : '?';
        url += `section_id=${sectionId}`;

        getApi(url).then((data) => {
            setProduct(data.getElementProduct())
            updatePointInfinity(data.getElementPointInfinity(), infinityFuc)
            updateShowing(data.getElementShowing())

        })
    })
}

if (show) {
    show.addEventListener("change", (event) => {
        const value = event.target.value;
        const sectionId = event.target.dataset.sectionId
        const url = `${window.Shopify.routes.root}cart/update.js`;
        const data = {
            attributes: {
                items_per_page: value
            },
            sections: [sectionId]
        };
        const options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        function getResponse(res) {
            return res.json()
                .then(data => data.sections[sectionId])
        }

        getApi(url, options, getResponse).then((data) => {
            setProduct(data.getElementProduct())
            updatePointInfinity(data.getElementPointInfinity(), infinityFuc)
            updatePaginate(data.getPaginate(), paginateFuc)
            updateShowing(data.getElementShowing())
        })
    })
}

if (filterForms) {
    filterForms.forEach(input => {
        input.addEventListener('change', event => {
            const value = event.target.value;
            const name = event.target.name;
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
            const url = createUrlFilter(callback, window.location.search)
            history.pushState(null, null, url);

            getApi(url).then((data) => {
                setProduct(data.getElementProduct())
                updateCount(data.getProductCount())
                updatePaginate(data.getPaginate(), paginateFuc)
                updateShowing(data.getElementShowing())
                updatePointInfinity(data.getElementPointInfinity(), infinityFuc)
            })
        })
    })
}

if (filterPrice) {
    const params = { 'filter.v.price.gte': 0, 'filter.v.price.lte': Number.MAX_SAFE_INTEGER }
    filterPrice.forEach(input => {
        input.addEventListener('change', event => {
            const value = event.target.value;
            const name = event.target.name;
            const max = event.target.dataset.max;
            params['filter.v.price.lte'] = max;
            params[name] = value;

            function callback(checkedValues) {
                for (const key in params) {
                    checkedValues[key] = [];
                    checkedValues[key].push(params[key]);
                }

            }
            const url = createUrlFilter(callback, window.location.search)
            history.pushState(null, null, url);
            getApi(url).then((data) => {
                setProduct(data.getElementProduct())
                updateCount(data.getProductCount())
                updatePointInfinity(data.getElementPointInfinity(), infinityFuc)
                updatePaginate(data.getPaginate(), paginateFuc)
                updateShowing(data.getElementShowing())
            })
        }

        )
    })
}

paginateFuc(paginateLinks)

function paginateFuc(paginateLinks) {
    if (paginateLinks) {
        paginateLinks.forEach(paginateLink => {
            paginateLink.addEventListener("click", (event) => {
                const target = event.target
                const url = target.dataset.url
                const sectionId = target.dataset.sectionId

                function callback(searchParams) {
                    searchParams.set('section_id', sectionId)
                }
                const _url = createUrl(callback, url.split('?')[1])
                getApi(_url).then((data) => {
                    setProduct(data.getElementProduct());
                    updatePaginate(data.getPaginate(), paginateFuc)
                    updateShowing(data.getElementShowing())
                    // remove listener
                })
            })
        })
    }
}
