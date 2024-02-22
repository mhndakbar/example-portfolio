(function (app) {
  app.siteUrl = 'https://mhndakbar.github.io/example-portfolio';
  app.portfolioItems = [];
  app.selectedItem = {};

  app.homepage = function () {
    setCopyRightDate();
    wireContactForm();
  };

  app.portfolio = async function () {
    setCopyRightDate();
    await loadPageData();
    updateOverviewPage();
    updatePageMenu();
  };

  app.workItem = async function () {
    setCopyRightDate();
    await loadPageData();
    loadspecificItem();
    updateItemPage();
    updatePageMenu();
  };

  function setCopyRightDate() {
    const currentYear = new Date();
    document.getElementById('copyrightYear').innerText =
      currentYear.getFullYear();
  }

  function wireContactForm() {
    const contactForm = document.getElementById('contact-form');
    contactForm.onsubmit = contactSubmit;
  }

  function contactSubmit(e) {
    e.preventDefault();
    const contactForm = document.getElementById('contact-form');

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');

    const mailTo = `mailto:${email.value}?subject=Contact From ${name.value}&body=${message.value}`;
    window.open(mailTo);

    name.value = '';
    email.value = '';
    message.value = '';
  }

  async function loadPageData() {
    // session stoarge will be available unitll user close the tab of the browser
    const cachedData = sessionStorage.getItem('site-data');

    if (cachedData !== null) {
      app.portfolioItems = JSON.parse(cachedData);
    } else {
      const response = await fetch(app.siteUrl + '/js/workitems.json');
      const data = await response.json();
      app.portfolioItems = data;
      sessionStorage.setItem('site-data', JSON.stringify(data));
    }
  }

  function loadspecificItem() {
    const params = new URLSearchParams(window.location.search);
    let item = Number.parseInt(params.get('item'));

    if (item > app.portfolioItems.length || item < 1) {
      item = 1;
    }
    app.selectedItem = app.portfolioItems[item - 1];
    app.selectedItem.id = item;
  }

  function updateItemPage() {
    const header = document.getElementById('workitem-header');
    header.innerText = `0${app.selectedItem.id} ${app.selectedItem.itemTitle}`;

    const img = document.getElementById('workitem-image');
    img.src = app.siteUrl + app.selectedItem.itemImageFull;
    img.alt = app.selectedItem.itemImageFullAlt;

    const projectText = document.querySelector('#project-text p');
    projectText.innerText = app.selectedItem.projectText;

    const originalTechList = document.querySelector('#technologies-text ul');
    const technlogySection = document.getElementById('technologies-text');
    const ul = document.createElement('ul');

    app.selectedItem.itemTechnologies.forEach((el) => {
      const li = document.createElement('li');
      li.innerText = el;
      ul.appendChild(li);
    });

    originalTechList.remove();
    technlogySection.appendChild(ul);

    const challengesText = document.querySelector('#challenges-text p');
    challengesText.innerText = app.selectedItem.challengesText;
  }

  function updateOverviewPage() {
    const main = document.getElementById('portfolio-main');
    const fragment = new DocumentFragment();

    app.portfolioItems.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('highlight');

      const itemImg = document.createElement('img');
      itemImg.src = app.siteUrl + item.itemImageSmall;
      itemImg.alt = item.itemImageSmallAlt;

      const itemTextDiv = document.createElement('div');
      const itemH2 = document.createElement('h2');

      const itemId = index + 1;

      if (itemId % 2 === 0) {
        itemDiv.classList.add('invert');
      }
      const titleArr = item.itemTitle.split(' ');
      const br = document.createElement('br');

      itemH2.innerHTML = `0${itemId}.`;
      titleArr.forEach((word) => {
        itemH2.innerHTML = itemH2.innerHTML + ` ${word}`;
        itemH2.appendChild(br);
      });

      const itemAnchor = document.createElement('a');
      itemAnchor.innerText = 'see more';
      itemAnchor.href = app.siteUrl + `/workitem.html?item=${itemId}`;

      itemTextDiv.appendChild(itemH2);
      itemTextDiv.appendChild(itemAnchor);
      itemDiv.appendChild(itemImg);
      itemDiv.appendChild(itemTextDiv);

      fragment.appendChild(itemDiv);
    });

    main.appendChild(fragment);
  }

  function updatePageMenu() {
    const menuUl = document.getElementById('page-menu');
    const fragment = new DocumentFragment();

    app.portfolioItems.forEach((item, index) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = `${app.siteUrl}/workitem.html?item=${index + 1}`;
      anchor.innerText = `Item #${index + 1}`;
      li.appendChild(anchor);

      fragment.appendChild(li);
    });

    menuUl.appendChild(fragment);
  }
})((window.app = window.app || {}));
