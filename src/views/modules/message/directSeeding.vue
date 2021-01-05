<template>
	<div>
		<course-list></course-list>
	</div>
</template>

<script>
	import CourseList from '../../common/live/courselist'
	export default {
		name:"directSeeding",
		components: {
			'CourseList': CourseList,
		}
	}
</script>
