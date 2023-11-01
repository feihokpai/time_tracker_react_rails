class TimeUtilities
  class << self
    def duration_as_complete_string(seconds)
      seconds = (seconds % 60).to_i
      duration_as_string(seconds) + "#{seconds}s"
    end

    def duration_as_string(seconds)
      hours = (seconds / 3600).to_i
      minutes = ((seconds % 3600) / 60).to_i
      "#{hours}h#{minutes}m"
    end
  end
end
