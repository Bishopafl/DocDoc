class ForumPostsController < ApplicationController
	before_action :authenticate_user!

	def index
		forum_id = params[:forum_thread_id]

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

	def edit
		forum_id = params[:forum_thread_id]
		post_id = params[:id]

		@forum_list = ForumThread.find_by(id: forum_id)
			if @forum_list == nil 
				redirect_to('/404')
			else
				@forum_post = @forum_list.forum_posts.find_by(id: post_id)
					if @forum_post == nil
						redirect_to('/404')
					else
						@thread.user = current_user
						render("edit")
					end
			end
	end

	def update
		forum_id = params[:forum_thread_id]
		post_id = params[:id]

		@forum_list = ForumThread.find_by(id: forum_id)
			if @forum_list == nil
				redirect_to("/404")
			else
				@forum_post = @forum_list.forum_posts.find_by(id: post_id)
				if @forum_post.update(post_params)
					redirect_to("/forum_threads/#{@forum_list.id}")
				else
					render('edit')
				end
			end
	end

	def destroy
		@forum_post = ForumPost.find_by(id: params[:id])
		if @forum_post == nil
			redirect_to("/404")
		else
			@forum_post.destroy

			flash[:notice] = "Post was successfully deleted"

			forum_id = params[:forum_thread_id]
			redirect_to("/forum_threads/#{forum_id}")
		end
	end 

private

	def post_params
		params.require(:forum_post).permit(:body)
	end
end
