angular.module('efg.indexView', [
	'efg.mockService',
	'efg.regexFilter',
	'efg.componentDirective',
	'bootstrap.thumbnailDirective',
	'ng',
	'ngRoute'
])

.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'IndexCtrl as index',
		templateUrl: 'efg.indexView.tpl.html'
	});
})

.controller('IndexCtrl', function(mock, $log, $filter) {
	mock.get('/api/v1/group').then(angular.bind(this, function success(result) {
		this.groups = result;
	}));
	mock.get('/api/v1/member?fields=name,duties,img').then(angular.bind(this, function success(result) {
		this.members = result.map(function(member) {
			return {
				id: member.id,
				title: [member.name.givenname, member.name.familyname].join(' '),
				subtitle: member.duties.join(', '),
				img: member.img
			};
		});
	}));
	mock.get('/api/v1/event?limit=3&fields=name,date,img').then(angular.bind(this, function success(result) {
		this.events = result.map(function(event) {
			return {
				id: event.id,
				title: event.name,
				subtitle: (event.date.length > 1) ?
					event.date
						.reduce(function(prev, now) {
							var min = prev[0]
							  , max = prev[1];
							
							if (now < min) { min = now; }
							if (now > max) { max = now; }
							
							return [min, max];
						}, [Number.MAX_VALUE, Number.MIN_VALUE])
						.map(function(date) {
							return $filter('date')(new Date(date), 'd. MMMM');
						})
						.join(' bis ') :
					$filter('date')(new Date(event.date[0]), 'd. MMMM HH:mm'),
				img: event.img
			};
		});
	}));
	mock.get('/api/v1/next').then(angular.bind(this, function success(result) {
		this.next = result;
	}));
	mock.get('/api/v1/info').then(angular.bind(this, function success(result) {
		this.infos = result;
	}));
	mock.get('/api/v1/contact?fields=name,action,img').then(angular.bind(this, function success(result) {
		this.contacts = result.map(function(contact) {
			return {
				id: contact.id,
				title: contact.name,
				subtitle: contact.action,
				img: contact.img
			};
		});
	}));
});