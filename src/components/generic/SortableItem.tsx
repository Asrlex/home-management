import { forwardRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

interface SortableItemProps {
  id: number;
  children: (setActivatorNodeRef: (node: HTMLElement | null) => void, attributes: any, listeners: any, ref: React.Ref<any>) => React.ReactNode;
}

const SortableItem = forwardRef<HTMLElement, SortableItemProps>((props, ref) => {
  const { attributes, listeners, setNodeRef, transform, transition, setActivatorNodeRef } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children(setActivatorNodeRef, attributes, listeners, ref)}
    </div>
  );
});

export default SortableItem;