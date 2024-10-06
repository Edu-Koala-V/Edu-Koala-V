// TODO: DOKONAJ REFAKTORYZACJI I SWTIERDZENIE CZY KOD JEST POTRZEBNY

if(document.querySelector('.add-new-resources'))
document.querySelector('.add-new-resources').addEventListener('click', () => {
    createModal(headerText="Dodawanie nowego zasobu",1,size = "medium");
    setupNewResourceModal();
});
const servicesICONS = [
    {data: "gdrive", name: 'Google Drive', icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_48dp.png'},
    {data: "mega_nz", name: 'Mega.nz', icon: 'https://mega.nz/favicon.ico'},
    {data: "dropbox", name: 'Dropbox', icon: 'https://www.dropbox.com/static/images/favicon-vflUeLeeY.ico'}
];
function setupNewResourceModal(){
const modalContent = document.querySelector('.modal-content');

const labelName = document.createElement('label');
labelName.setAttribute('for','resource-name');
labelName.innerText = 'Nazwa zasobu:';
modalContent.appendChild(labelName);
inputName = document.createElement('input');
inputName.setAttribute('type','text');
inputName.setAttribute('id','resource-name');
inputName.setAttribute('required','true');
modalContent.appendChild(inputName);

const labelLink = document.createElement('label');
labelLink.setAttribute('for','resource-link');
labelLink.innerText = 'Link do zasobu:';
modalContent.appendChild(labelLink);
inputLink = document.createElement('input');
inputLink.setAttribute('type','text');
inputLink.setAttribute('id','resource-link');
inputLink.setAttribute('required','true');
modalContent.appendChild(inputLink);

const labelType = document.createElement('label');
labelType.setAttribute('for','resource-type');
labelType.innerText = 'Typ zasobu:';
modalContent.appendChild(labelType);


const divServices = document.createElement('div');
divServices.classList.add('services-select');
modalContent.appendChild(divServices);
for (let service of servicesICONS){
    const serviceIcon = document.createElement('img');
    serviceIcon.setAttribute('src',service.icon);
    serviceIcon.setAttribute('alt',service.name);
    serviceIcon.setAttribute('title',service.name);
    serviceIcon.setAttribute('data-type',service.data);
    serviceIcon.classList.add('service-icon');
    divServices.appendChild(serviceIcon);
    serviceIcon.addEventListener('click',()=>{
        document.querySelectorAll('.service-icon').forEach(icon => {
            icon.classList.remove('selected');
            serviceIcon.classList.add('selected');
    });
    });
}

const notExistService = document.createElement('label');
notExistService.innerText = 'Dodaj inny serwis wpisując jeko nazwę domeny i wybierając ikonę z zasobu.';
notExistService.setAttribute('for','resource-service');
modalContent.appendChild(notExistService);
const inputService = document.createElement('input');
inputService.setAttribute('type','text');
inputService.setAttribute('id','resource-service');
modalContent.appendChild(inputService);
inputService.addEventListener('input',()=>{
    document.querySelectorAll('.service-icon').forEach(icon => {
        icon.classList.remove('selected');
        if(document.querySelector('.service-icon-other')){
            document.querySelector('.service-icon-other').remove();
        }
        const serviceIcon = document.createElement('img');
        serviceIcon.setAttribute('src','https://www.google.com/s2/favicons?domain='+inputService.value);
        serviceIcon.setAttribute('alt',inputService.value);
        serviceIcon.setAttribute('title',inputService.value);
        serviceIcon.classList.add('service-icon');
        serviceIcon.classList.add('service-icon-other');
        serviceIcon.setAttribute('data-type',inputService.value);
        divServices.appendChild(serviceIcon);
        serviceIcon.addEventListener('click',()=>{
            document.querySelectorAll('.service-icon').forEach(icon => {
                icon.classList.remove('selected');
                serviceIcon.classList.add('selected');
        });
        });
    });
});

const buttonAdd = document.createElement('button');
buttonAdd.classList.add('btn','primary','add-resource');
buttonAdd.innerText = 'Dodaj';
document.querySelector('.modal-right-container').appendChild(buttonAdd);
buttonAdd.addEventListener('click',()=>{
    const resourceDataTab = validateResource();
    if(resourceDataTab !== null){
        
       console.log(resourceDataTab);
    }
       //TODO DODAĆ WALIDACJĘ DANYCH I ZAPISYWANIE DO BAZY
});
}

function validateResource(){
    const resourceName = document.querySelector('#resource-name').value;
    const resourceLink = document.querySelector('#resource-link').value;
    if(document.querySelector('.service-icon.selected')==null){
        return null;
    }
    const resourceType = document.querySelector('.service-icon.selected').getAttribute('data-type');
    if(resourceType !== '' && resourceName !== '' && resourceLink !== ''){
        return [resourceName,resourceLink,resourceType];
    } else {
        return null;
    }
}