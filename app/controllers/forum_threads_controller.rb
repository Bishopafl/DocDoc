class ForumThreadsController < ApplicationController
	before_action :authenticate_user!, except: ["index"]

	def index
		@thread_list = ForumThread.all
		render "index"
	end

	def new 
		@new_thread = ForumThread.new
		render("new")
	end

	def create
		thread_id = params[:id]

		@thread = ForumThread.new(thread_params)

		if @thread.save == nil
			redirect_to('/404')
		else
			redirect_to("/forum_threads")
		end

	end

	def show
		thread_id = params[:id]

		@thread = ForumThread.find_by(id: thread_id)

		if @thread == nil
			redirect_to('/404')
		else
			render('show')
		end
	end

		private

		def thread_params
			params.require(:forum_thread).permit(:subject)
		end

end
