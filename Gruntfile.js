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

		// browserSync: {
			
		// 	bsFiles: {
		//         src : ['<%= site.pages %>', '<%= site.dest %>/projects/*.html', '<%= site.assets %>/css/*.css']
		//     },
		    
		//     options: {
		//         server: {
		//             baseDir: "<%= site.dest %>",
		//             tunnel: false,
		//             injectChanges: true,
		//         },
		//         watchTask: true,
		//     }

		// },

		clean: {
			server: ['<%= assemble.projects.dest %>', '<%= site.assets %>', '!<%= site.assets %>' ]
		},

		concurrent: {
			server: ['sass', 'assemble:site', 'assemble:projects'],
		},

		connect: {
	      options: {
	        port: 9000,
	        livereload: 35729,
	        // change this to '0.0.0.0' to access the server from outside
	        hostname: 'localhost'
	      },
	      livereload: {
	        options: {
	          open: true,
	          base: [
	            '<%= site.dest %>'
	          ]
	        }
	      }
	    },

	    copy: {
	    	main: {
	    		expand: true,
	    		cwd: './bower_components/bootstrap/dist/js/',
	    		src: '**',
	    		dest: '<%= site.assets %>/js/',
	    		flatten: true
	    	}
	    },

	    sass: {
	    	dist: {
	    		options: {
	    			style: 'expanded'
	    		},
	    		files: {
	    			'./assets/css/main.css': './src/sass/main.scss'
	    		}
	    	}
	    },

		replace: {
			// dist: {
			// 	options: {
			// 		patterns: [
			// 			{
			// 				match: "href=\"/\"",
			// 				replacement: "href=\"http://www.tanmvo.com\""
			// 			}
			// 		]
			// 	},
			// 	files: {
			// 		expand: true,
			// 		flatten: true,
			// 		src: ['<%= site.dest %>/index.html'],
			// 		dest: '<%= site.dest %>'
			// 	}
			// }
		},

		watch: {
			options: {
				livereload: true,
			},
			
			assemble: {
				files: ['<%= site.pages %>', '<%= site.data %>/*.json', '<%= site.includes %>', '<%= site.projects %>' ],
				tasks: ['assemble']
			},

			// css: {
			// 	files: ['<%= site.assets %>/css/*.css'],
			// },

			sass: {
				files: ['<%= site.styles %>'],
				tasks: ['sass']
			},

			livereload: {
		        options: {
		          livereload: '<%= connect.options.livereload %>'
		        },
		        files: [
		          '<%= site.dest %>/*.html',
		          '<%= site.projects %>/*.html',
		          '<%= site.assets %>/css/*.css',
		          '<%= site.assets %>/img/*.{gif,jpg,jpeg,png,svg,webp}'
		        ]
		    }
		}
	
	});
	
	grunt.loadNpmTasks('assemble');
	// grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'copy', 'concurrent:server', 'connect', 'watch']);
	grunt.registerTask('dist', ['clean', 'assemble', 'sass', 'replace:dist']);
}

