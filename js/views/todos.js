/// js/views/todos.js

var app = app || {};

/// Todo Item View 
/// --------------
app.TodoView = Backbone.View.extend({

	///... is a list tag
	tagName: 'li',

	/// Cache the template function for a single item
	template: _.template( $('#item-template').html() ),

	/// The DOM events specific to an item
	events: {
		'dblclick label': 'edit',
		'keypress .edit': 'updateOnEnter',
		'blur .edit': 'close'
	},

	/// The TodoView listens for changes to its model, re-rendering. Since there's
	/// a one-to-one correspondence between a **Todo** and a **TodoView** in this 
	/// app, we set a direct reference on the model for convenience.
	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
	},

	render: function(){
		this.$el.html( this.template(this.model.attributes ) );
		this.$input = this.$('.edit');
		return this;
	},

	/// Toggle visibility of item
	toggleVisible: function(){
		this.$el.toggleClass('hidden', this.isHidden());
	},

	/// Determines if item should be hidden
	isHidden: function(){
		var isCompleted = this.model.get('completed');
		return ( ///hidden cases only 
			(!isCompleted && app.TodoFilter === 'completd') ||
				(isCompleted && app.TodoFilter === 'active')
		);
	},

	/// Toggle the "completed" state of the model
	toggleCompleted: function(){
		this.model.toggle();
	},

	/// Switch this view into "editing" mode, displaying the input field.
	edit: function(){
		this.$el.addClass('editing');
		this.$input.focus();
	},

	/// Close the "editing" mode, saving changes to the todo.
	close: function(){
		var value = this.$input.val().trim();

		if( value ) {
			this.model.save({ title: value });
		}

		this.$el.removeClass('editing');
	},


	/// If you hit "enter", we're throguh editing the item
	updateOnEnter: function( e ){
		if (e.which === ENTER_KEY ){
			this.close();
		}
	},

	/// Remove the item, destroy the model from *localStorage* and delete its view
	clear: function(){
		this.model.destroy();
	}

});