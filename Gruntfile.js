module.exports = function(grunt) {
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		site: grunt.file.readYAML('_config.yaml'),
		
		assemble: {
		
		  projects: {
	        src: ['<%= site.projects %>'],
	        dest: '<%= site.dest %>/projects/',
	        options: {
		        flatten: true,
		        assets: '<%= site.assets %>',
		        data: '<%= site.data %>/*.{json,yml}',

		        // Templates
		        partials: '<%= site.includes %>',
		        layoutdir: '<%= site.layouts %>',
		        layout: 'project.hbs',
	    	},
	      },

	      site: {
	        src: ['<%= site.pages %>'],
	        dest: '<%= site.dest %>',
	        options: {
		        flatten: true,
		        assets: '<%= site.assets %>',
		        data: '<%= site.data %>/*.{json,yml}',

		        // Templates
		        partials: '<%= site.includes %>',
		        layoutdir: '<%= site.layouts %>',
		        layout: '<%= site.layout %>',
		        collections: [{
		        	name: 'project',
		        	sortby: 'order',
		        	sortorder: 'ascending',
		        }]
	        },
	      },

		},

		browserSync: {
			
			bsFiles: {
		        src : ['<%= site.pages %>', '<%= site.dest %>/projects/*.html']
		    },
		    
		    options: {
		        server: {
		            baseDir: "<%= site.dest %>",
		            tunnel: false,
		            injectChanges: true,
		        },
		        watchTask: true,
		    }

		},

		clean: {
			server: ['<%= assemble.projects.dest %>']
		},

		watch: {
			options: {
				livereload: true,
			},
			assemble: {
				files: ['<%= site.pages %>', '<%= site.projects %>'],
				tasks: ['assemble']
			},
		}
	
	});
	
	grunt.loadNpmTasks('assemble');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'assemble', 'browserSync', 'watch']);

}

