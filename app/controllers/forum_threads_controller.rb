class ForumThreadsController < ApplicationController
	before_action :authenticate_user!, except: ["index"]

	def index
		@user = current_user
		@thread_list = ForumThread.order(created_at: :desc)
		render "index"
	end

	def new 
		@new_thread = ForumThread.new
		render("new")
	end

	def create
		thread_id = params[:id]

		@thread = ForumThread.new(thread_params)
		@thread.user = current_user

		if @thread.save == nil
			redirect_to('/404')
		else
			redirect_to("/forum_threads")
		end

	end

	def show
		thread_id = params[:id]
		forum_id = params[:forum_thread_id]

		@thread = ForumThread.find_by(id: thread_id)
		@new_post = @thread.forum_posts.new

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
