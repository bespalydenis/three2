// Обозначаю $, когда выделяю элемент из dom
let $select = document.querySelector('#select')
let $renderType = document.querySelector('#renderType')
let $updateSize = document.querySelector('#updateSize')
let $size = document.querySelector('#size')
let $uids = document.querySelector('#uids')

let scene = new THREE.Scene(2, 10)


var render = function(type = 'cube'){
	let camera = new THREE.PerspectiveCamera( 10, window.innerWidth/window.innerHeight, .1, 1000 )


	let renderer = new THREE.WebGLRenderer({
		antialias: true
	})

	renderer.setClearColor( 0xffffff )
	renderer.setSize( window.innerWidth, window.innerHeight )
	document.body.appendChild( renderer.domElement )

	let controls = new THREE.OrbitControls(camera, renderer.domElement)

	let geometry, element, material
	switch(type) {
		case 'cube':
			geometry = new THREE.BoxBufferGeometry( .6, .6, .6 )
			break;
		case 'cylinder':
			geometry = new THREE.CylinderGeometry( 1,1,1 );
			break;
		case 'sphere':
			geometry = new THREE.SphereGeometry( 1, 50, 50 );
			break;
	}

	addToScene()
	console.log(scene)


	function addToScene() {
		//material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true} )
		material = new THREE.MeshLambertMaterial({ color: 0x1ec876 } )
		element = new THREE.Mesh( geometry, material )
		// element.position.set(2, 1, 1)
		element.receiveShadow = true
		// element.material.color.setHex( 0xf60000 );
		element.position.x = Math.random() * 6   
		element.position.y = Math.random() * 6   
		element.position.x = Math.random() * 6  
		element.updateMatrix();

		scene.add( element )



		let uuid = scene.children[scene.children.length-1].uuid;
		let uuid_index = scene.children.length-1
		uids.insertAdjacentHTML('beforeEnd', '<div class="uuid_el" data-uuid="'+uuid+'"><a class="removeFromScene" href="javascript:void(0);">&times</a>'+uuid+'</div>')
	}

	let isLightOn = false
	scene.children.forEach(function(mash, i){
		if(mash.type === 'PointLight') {
			isLightOn = true
		}
	})
	console.log('isLightOn',isLightOn)

	if(!isLightOn) {
		let skyboxGeometry = new THREE.CubeGeometry(10000, 10000, 10000)
		let skyboxMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.BackSide })
		let skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial)
		scene.add(skybox)

		let pointLight = new THREE.PointLight(0xffffff)
		pointLight.position.set(0, 300, 200)
		scene.add(pointLight)

		let clock = new THREE.Clock
	}

	camera.position.x = 5
	camera.position.y = 5
	camera.position.z = 5

	element.rotation.x = 0
	element.rotation.y = 0

	function animate() {
		requestAnimationFrame(animate)
		controls.update(0,0,0)
		renderer.render(scene, camera)
	}
	animate()
};


render()

// Выбор фигуры
$select.addEventListener('click', function(e){
	if(e.target.classList.contains('select_option')) {
		let selectedType = e.target.dataset.type
		//document.querySelector('canvas').remove()
		document.querySelector('.select_option.active').classList.remove('active')
		e.target.classList.add('active')
		$renderType.innerHTML = e.target.textContent
		render(selectedType)
	}
})

// Изменение размера
$updateSize.addEventListener('click', function(e){
	let size = [].slice.call(document.querySelectorAll('#size input'))
	let selectedType = document.querySelector('.select_option.active').dataset.type
	size = size.map(function(el){
		return +el.value
	})
	let uuid = document.querySelector('.uuid_el.active').dataset.uuid
	scene.children.forEach(function(x, i){
		if(x.uuid == uuid) {
			scene.children[i].scale.set(size[0],size[1],size[2]);
		} 			
		i++
	})
})

// Выбираем элемент для изменения scale
$uids.addEventListener('click', function(e){
	if(e.target.classList.contains('uuid_el')) {
		let uuid = e.target.dataset.uuid
		if(document.querySelector('.uuid_el.active')) document.querySelector('.uuid_el.active').classList.remove('active')
		e.target.classList.add('active')
		$size.classList.add('valid')
		document.querySelectorAll('#size input').forEach(function(x){
			x.value = 1
		})
	}
})

// Удаление сцены
$uids.addEventListener('click', function(e){
	if(e.target.classList.contains('removeFromScene')) {
		let uuid = e.target.closest('div').dataset.uuid
		scene.children.forEach(function(x, i){
			if(x.uuid == uuid) {
				console.log('yes',i)
				scene.remove(scene.children[i])
			} 			
			i++
		})
		console.log(uuid) 
    	e.target.closest('div').remove()
	}
})