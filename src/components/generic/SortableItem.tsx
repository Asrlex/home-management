import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface SortableItemProps {
  id: number;
  children: (
    setActivatorNodeRef: (node: HTMLElement | null) => void,
    attributes: DraggableAttributes,
    listeners: SyntheticListenerMap,
    ref: React.Ref<HTMLElement>
  ) => React.ReactNode;
}

const SortableItem = forwardRef<HTMLElement, SortableItemProps>(
  (props, ref) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      setActivatorNodeRef,
    } = useSortable({ id: props.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style}>
        {props.children(setActivatorNodeRef, attributes, listeners, ref)}
      </div>
    );
  }
);

SortableItem.displayName = 'SortableItem';

export default SortableItem;
