module ApplicationHelper
  def show_logout_link
    return unless defined? current_user

    if current_user.present?
      link_to destroy_user_session_path do
        "Logout"
      end
    end
  end

  def bootstrap_class_for(flash_type)
    case flash_type.to_sym
    when :notice then "alert-info"
    when :success then "alert-success"
    when :error then "alert-danger"
    when :alert then "alert-warning"
    else
      flash_type.to_s
    end
  end
end
