class ForumPostsController < ApplicationController

	def index
		forum_id = params[:id]

		@forum_list = ForumThread.find_by(id: forum_id)

		if @forum_list == nil
			redirect_to("/404")
		else
			@forum_posts = @forum_list.forum_posts
			render "index"
		end
	end

	def new 
		forum_id = params[:forum_thread_id]

		@forum_list = ForumThread.find_by(id: forum_id)
		@new_post = @forum_list.forum_posts.new
		render("new")
	end

	def create
		forum_id = params[:forum_thread_id]
		@forum_thread = ForumThread.find_by(id: forum_id)
		@forum_post = @forum_thread.forum_posts.new(post_params)

		if @forum_post.save
			flash[:notice] = "Post created"
			redirect_to("/forum_threads/#{@forum_thread.id}/")
		else
			render('new')
		end
	end

private

		def post_params
			params.require(:forum_post).permit(:body)
		end
end
