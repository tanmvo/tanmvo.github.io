module.exports = function(grunt) {
	grunt.initConfig({
		
		pkg: grunt.file.readJSON('package.json'),
		site: grunt.file.readYAML('_config.yaml'),
		
		assemble: {
		  posts: {
        src: ['<%= site.posts %>'],
        dest: '<%= site.dest %>/posts/',
        options: {
	        flatten: true,
	        assets: '<%= site.assets %>',
	        data: '<%= site.data %>/*.{json,yml}',

	        // Templates
	        partials: '<%= site.includes %>',
	        layoutdir: '<%= site.layouts %>',
	        layout: 'post.hbs',
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
        },
      },
		},

		clean: {
			server: ['<%= assemble.posts.dest %>', '<%= site.assets %>', '!<%= site.assets %>' ]
		},

		concurrent: {
			server: ['sass', 'assemble:site', 'assemble:posts'],
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

		watch: {
			options: {
				livereload: true,
			},
			
			assemble: {
				files: ['<%= site.pages %>', '<%= site.data %>/*.json', '<%= site.includes %>', '<%= site.posts %>' ],
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
		          '<%= site.posts %>/*.html',
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

