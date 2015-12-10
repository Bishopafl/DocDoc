class UsersController < ApplicationController
	before_action :authenticate_user!, except: [ "home", "index"]
	before_action :authenticate_admin!, only: ["index"]

# renders the home page
  def home
    if user_signed_in? == true
      @name = current_user.email
    else
      redirect_to "/signup"
    end
  end


  def index
    @users = User.all
  end

  # renders the signup form
  def new
  end

  def show
  end

  # receives form and creates a user from that data
  def create
    user = User.new(user_params)
    if user.save
      redirect_to '/'
    else
      redirect_to '/signup'
    end
  end   

  private

  def user_params
     params.require(:user).permit(:username, :email)
  end

end