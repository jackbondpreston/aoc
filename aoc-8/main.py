# node struct
class Node:
    def __init__(self, num_children, num_metadata):
        self.num_children = num_children
        self.num_metadata = num_metadata
        self.metadata = []
        self.children = []

    def full_children(self):
        return len(self.children) == self.num_children
    
    def full_metadata(self):
        return len(self.metadata) == self.num_metadata

    def total_metadata(self):
        return sum(self.metadata) + sum([ c.total_metadata() for c in self.children ])

    def value(self):
        if self.num_children == 0:
            return sum(self.metadata)
        else:
            val = 0
            for index in self.metadata:
                if index <= len(self.children):
                    val += self.children[index - 1].value()
            
            return val

# build tree, list of ints -> root Node
def build_tree(inputs):
    root = None
    node_stack = list()

    i = 0

    while root == None:
        top_node = node_stack[-1] if node_stack else None

        if top_node == None or not top_node.full_children():
            num_children = inputs[i]
            num_metadata = inputs[i + 1]

            node_stack.append(Node(num_children, num_metadata))

            i += 2
        
        else:
            for j in range(top_node.num_metadata):
                top_node.metadata.append(inputs[i])
                i += 1

            node = node_stack.pop()
            
            if node_stack:
                node_stack[-1].children.append(node)
            else:
                root = node
        
    return root

root = build_tree(list(map(lambda x: int(x), open("inputs.txt").read().split(' '))))
print(f"[Part 1] Total metadata sum: { root.total_metadata() }")
print(f"[Part 2] Root node value: { root.value() } ")