module HasSortableList
  def adjust_items_order_if_has_duplicates
    adjust_items_order if sortable_items.size != sortable_items.map(&:order).uniq.size
  end

  def adjust_items_order
    ordered_items.each_with_index do |item, index|
      item.update!(order: (index + 1))
    end
  end

  def ordered_items
    sortable_items.order(:order)
  end

  def move_up_order(item)
    current_position = ordered_items.index(item)
    return if current_position.nil?
    return if current_position == 0

    previous_item = ordered_items[current_position - 1]
    previous_item_order = previous_item.order
    previous_item.update!(order: item.order)
    item.update!(order: previous_item_order)
  end

  def move_down_order(item)
    current_position = ordered_items.index(item)
    return if current_position.nil?
    last_index = sortable_items.size - 1
    return if current_position == last_index

    next_item = ordered_items[current_position + 1]
    next_item_order = next_item.order
    next_item.update!(order: item.order)
    item.update!(order: next_item_order)
  end
end
