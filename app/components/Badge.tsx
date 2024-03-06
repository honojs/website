export function Badge(props: { text: string; type: 'info' | 'tip' | 'warning' | 'danger' }): JSX.Element {
  return <span class={`badge badge-${props.type}`}>{props.text}</span>
}
