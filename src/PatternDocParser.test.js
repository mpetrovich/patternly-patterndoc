var expect = require('chai').expect;
var PatternDocParser = require('./PatternDocParser.js');

describe('PatternDocParser', function() {

	describe('parse()', function() {

		describe('with multiple patterns', function() {
			var content = ''
				+ '/* ----------------------------------------\n'
				+ ' * @pattern PatternA\n'
				+ ' * @title A short title for PatternA\n'
				+ ' * @meta category Foos & Bars\n'
				+ ' * @meta version 1.0.3\n'
				+ ' * @param {Number} paramA - Required parameter for PatternA\n'
				+ ' * @param {Object} [paramB] - Optional parameter for PatternA\n'
				+ ' * @param {String} [paramC=some default] - Optional parameter for PatternA with a default value\n'
				+ ' * \n'
				+ ' * @todo First todo\n'
				+ ' * @todo Another future task\n'
				+ ' * \n'
				+ ' * @example Basic usage of PatternA\n'
				+ '```\n'
				+ '<pattern-a param-a="123"></pattern-a>\n'
				+ '```\n'
				+ ' * \n'
				+ ' * @example Advanced usage of PatternA\n'
				+ ' * @exampleHeight 300\n'
				+ '```\n'
				+ '<pattern-a\n'
				+ '	param-a="123"\n'
				+ '	param-b="{ foo: true }"\n'
				+ '	param-c="some value"\n'
				+ '></pattern-a>\n'
				+ '```\n'
				+ ' * \n'
				+ ' * @example\n'
				+ '```\n'
				+ '<pattern-a param-a="456"></pattern-a>\n'
				+ '```\n'
				+ ' * \n'
				+ ' * ---------------------------------------- */\n'
				+ '\n'
				+ 'Intermediate code\n'
				+ '@param NotAParam\n'
				+ '@pattern NotAPattern\n'
				+ '@param NotAnotherParam\n'
				+ '\n'
				+ '/* @todo A random comment */\n'
				+ '\n'
				+ '/*\n'
				+ '@pattern PatternB\n'
				+ '@title A short title for PatternB\n'
				+ '@meta version - 0.2.4\n'
				+ '@meta category - Something\n'
				+ '\n'
				+ '@deprecated Use PatternA instead\n'
				+ '\n'
				+ '@description\n'
				+ 'This is a description for PatternB.\n'
				+ '\n'
				+ 'The description continues on even more lines here.\n'
				+ '\n'
				+ '\n'
				+ 'Section Heading\n'
				+ '---------------\n'
				+ 'It even has section breaks delimited by a line of dashes.\n'
				+ 'With more lines that follow.\n'
				+ '\n'
				+ 'Another Heading\n'
				+ '---------------\n'
				+ 'Lots of sections here.\n'
				+ '\n'
				+ '@param {Number} paramA - Required parameter for PatternB\n'
				+ '@param {Object} [paramB] - Optional parameter for PatternB\n'
				+ '@param {String} [paramC=another default] - Optional parameter for PatternB with a default value\n'
				+ ''
				+ '@example Basic usage of PatternB\n'
				+ '```html\n'
				+ '	<pattern-b param-a="456"></pattern-b>\n'
				+ '```\n'
				+ '\n'
				+ '\n'
				+ '@example Advanced usage of PatternB\n'
				+ '@exampleHeight 250\n'
				+ '```js\n'
				+ 'scope.foo = "bar";\n'
				+ 'scope.what = "who";\n'
				+ '```\n'
				+ '```html\n'
				+ '<pattern-b\n'
				+ '	param-a="456"\n'
				+ '	param-b="{ bar: false }"\n'
				+ '	param-c="another value"\n'
				+ '></pattern-b>\n'
				+ '```\n'
				+ '\n'
				+ '@todo Some future task\n'
				+ ' */\n';

			var parser = new PatternDocParser();
			var patterns = parser.parse(content);

			it('should return the correct number of patterns', function() {
				expect( patterns.length ).to.equal(2);
			});

			describe('1st pattern', function() {
				var pattern = patterns[0];

				it('should have the correct pattern name', function() {
					expect( pattern.getName() ).to.equal('PatternA');
				});
				it('should have the correct pattern title', function() {
					expect( pattern.getTitle() ).to.equal('A short title for PatternA');
				});
				it('should have the correct meta category', function() {
					expect( pattern.getMeta().category ).to.equal('Foos & Bars');
				});
				it('should have the correct meta version', function() {
					expect( pattern.getMeta().version ).to.equal('1.0.3');
				});
				it('should have the correct number of pattern parameters', function() {
					expect( pattern.getParameters().length ).to.equal(3);
				});
				it('should have the correct number of todos', function() {
					expect( pattern.getMeta().todos.length ).to.equal(2);
				});
				it('should have the correct todos', function() {
					expect( pattern.getMeta().todos[0] ).to.equal('First todo');
					expect( pattern.getMeta().todos[1] ).to.equal('Another future task');
				});

				describe('1st parameter', function() {
					var parameter = pattern.getParameters()[0];

					it('should have the correct parameter name', function() {
						expect( parameter.getName() ).to.equal('paramA');
					});
					it('should have the correct parameter type', function() {
						expect( parameter.getType() ).to.equal('Number');
					});
					it('should have the correct parameter description', function() {
						expect( parameter.getDescription() ).to.equal('Required parameter for PatternA');
					});
					it('should be marked as required', function() {
						expect( parameter.getRequired() ).to.be.true;
					});
					it('should have the correct parameter default value', function() {
						expect( parameter.getDefaultValue() ).to.be.undefined;
					});
				});

				describe('2nd parameter', function() {
					var parameter = pattern.getParameters()[1];

					it('should have the correct parameter name', function() {
						expect( parameter.getName() ).to.equal('paramB');
					});
					it('should have the correct parameter type', function() {
						expect( parameter.getType() ).to.equal('Object');
					});
					it('should have the correct parameter description', function() {
						expect( parameter.getDescription() ).to.equal('Optional parameter for PatternA');
					});
					it('should be marked as not required', function() {
						expect( parameter.getRequired() ).to.be.false;
					});
					it('should have the correct parameter default value', function() {
						expect( parameter.getDefaultValue() ).to.be.undefined;
					});
				});

				describe('3rd parameter', function() {
					var parameter = pattern.getParameters()[2];

					it('should have the correct parameter name', function() {
						expect( parameter.getName() ).to.equal('paramC');
					});
					it('should have the correct parameter type', function() {
						expect( parameter.getType() ).to.equal('String');
					});
					it('should have the correct parameter description', function() {
						expect( parameter.getDescription() ).to.equal('Optional parameter for PatternA with a default value');
					});
					it('should be marked as not required', function() {
						expect( parameter.getRequired() ).to.be.false;
					});
					it('should have the correct parameter default value', function() {
						expect( parameter.getDefaultValue() ).to.equal('some default');
					});
				});

				it('should have the correct number of pattern examples', function() {
					expect( pattern.getExamples().length ).to.equal(3);
				});

				describe('1st example', function() {
					var example = pattern.getExamples()[0];

					it('should have the correct description', function() {
						expect( example.description ).to.equal('Basic usage of PatternA');
					});
					it('should have the correct example', function() {
						expect( example.codeBlocks.length ).to.equal(1);
						expect( example.codeBlocks[0].syntax ).to.be.null;
						expect( example.codeBlocks[0].code ).to.equal('<pattern-a param-a="123"></pattern-a>');
					});
				});

				describe('2nd example', function() {
					var example = pattern.getExamples()[1];

					it('should have the correct description', function() {
						expect( example.description ).to.equal('Advanced usage of PatternA');
					});
					it('should have the correct height', function() {
						expect( example.height ).to.equal(300);
					});
					it('should have the correct example', function() {
						expect( example.codeBlocks.length ).to.equal(1);
						expect( example.codeBlocks[0].syntax ).to.be.null;
						expect( example.codeBlocks[0].code ).to.equal(''
							+ '<pattern-a\n'
							+ '	param-a="123"\n'
							+ '	param-b="{ foo: true }"\n'
							+ '	param-c="some value"\n'
							+ '></pattern-a>'
						);
					});
				});

				describe('3rd example', function() {
					var example = pattern.getExamples()[2];

					it('should have the correct description', function() {
						expect( example.description ).to.equal('');
					});
					it('should have the correct example', function() {
						expect( example.codeBlocks.length ).to.equal(1);
						expect( example.codeBlocks[0].syntax ).to.be.null;
						expect( example.codeBlocks[0].code ).to.equal('<pattern-a param-a="456"></pattern-a>');
					});
				});
			});

			describe('2nd pattern', function() {
				var pattern = patterns[1];

				it('should have the correct pattern name', function() {
					expect( pattern.getName() ).to.equal('PatternB');
				});
				it('should have the correct pattern title', function() {
					expect( pattern.getTitle() ).to.equal('A short title for PatternB');
				});
				it('should have the correct pattern description', function() {
					expect( pattern.getDescription() ).to.equal(''
						+ '\nThis is a description for PatternB.\n'
						+ '\n'
						+ 'The description continues on even more lines here.\n'
						+ '\n'
						+ '\n'
						+ 'Section Heading\n'
						+ '---------------\n'
						+ 'It even has section breaks delimited by a line of dashes.\n'
						+ 'With more lines that follow.\n'
						+ '\n'
						+ 'Another Heading\n'
						+ '---------------\n'
						+ 'Lots of sections here.\n'
						+ '\n'
					);
				});
				it('should have the correct number of pattern parameters', function() {
					expect( pattern.getParameters().length ).to.equal(3);
				});
				it('should have the correct number of todos', function() {
					expect( pattern.getMeta().todos.length ).to.equal(1);
				});
				it('should have the correct todos', function() {
					expect( pattern.getMeta().todos[0] ).to.equal('Some future task');
				});
				it('should have the correct deprecation message', function() {
					expect( pattern.getMeta().deprecated ).to.equal('Use PatternA instead');
				});

				describe('1st parameter', function() {
					var parameter = pattern.getParameters()[0];

					it('should have the correct parameter name', function() {
						expect( parameter.getName() ).to.equal('paramA');
					});
					it('should have the correct parameter type', function() {
						expect( parameter.getType() ).to.equal('Number');
					});
					it('should have the correct parameter description', function() {
						expect( parameter.getDescription() ).to.equal('Required parameter for PatternB');
					});
					it('should be marked as required', function() {
						expect( parameter.getRequired() ).to.be.true;
					});
					it('should have the correct parameter default value', function() {
						expect( parameter.getDefaultValue() ).to.be.undefined;
					});
				});

				describe('2nd parameter', function() {
					var parameter = pattern.getParameters()[1];

					it('should have the correct parameter name', function() {
						expect( parameter.getName() ).to.equal('paramB');
					});
					it('should have the correct parameter type', function() {
						expect( parameter.getType() ).to.equal('Object');
					});
					it('should have the correct parameter description', function() {
						expect( parameter.getDescription() ).to.equal('Optional parameter for PatternB');
					});
					it('should be marked as not required', function() {
						expect( parameter.getRequired() ).to.be.false;
					});
					it('should have the correct parameter default value', function() {
						expect( parameter.getDefaultValue() ).to.be.undefined;
					});
				});

				describe('3rd parameter', function() {
					var parameter = pattern.getParameters()[2];

					it('should have the correct parameter name', function() {
						expect( parameter.getName() ).to.equal('paramC');
					});
					it('should have the correct parameter type', function() {
						expect( parameter.getType() ).to.equal('String');
					});
					it('should have the correct parameter description', function() {
						expect( parameter.getDescription() ).to.equal('Optional parameter for PatternB with a default value');
					});
					it('should be marked as not required', function() {
						expect( parameter.getRequired() ).to.be.false;
					});
					it('should have the correct parameter default value', function() {
						expect( parameter.getDefaultValue() ).to.equal('another default');
					});
				});

				it('should have the correct number of pattern examples', function() {
					expect( pattern.getExamples().length ).to.equal(2);
				});

				describe('1st example', function() {
					var example = pattern.getExamples()[0];

					it('should have the correct description', function() {
						expect( example.description ).to.equal('Basic usage of PatternB');
					});
					it('should have the correct example', function() {
						expect( example.codeBlocks.length ).to.equal(1);
						expect( example.codeBlocks[0].syntax ).to.equal('html');
						expect( example.codeBlocks[0].code ).to.equal('<pattern-b param-a="456"></pattern-b>');
					});
				});

				describe('2nd example', function() {
					var example = pattern.getExamples()[1];

					it('should have the correct description', function() {
						expect( example.description ).to.equal('Advanced usage of PatternB');
					});
					it('should have the correct height', function() {
						expect( example.height ).to.equal(250);
					});
					it('should have the correct example', function() {
						expect( example.codeBlocks.length ).to.equal(2);

						expect( example.codeBlocks[0].syntax ).to.equal('js');
						expect( example.codeBlocks[0].code ).to.equal(''
							+ 'scope.foo = "bar";\n'
							+ 'scope.what = "who";'
						);

						expect( example.codeBlocks[1].syntax ).to.equal('html');
						expect( example.codeBlocks[1].code ).to.equal(''
							+ '<pattern-b\n'
							+ '	param-a="456"\n'
							+ '	param-b="{ bar: false }"\n'
							+ '	param-c="another value"\n'
							+ '></pattern-b>'
						);
					});
				});
			});
		});

	});

});
