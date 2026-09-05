                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">
                        {order.id.slice(0, 8).toUpperCase()}...
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{order.user.firstName} {order.user.lastName}</div>
                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ৳{order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        {updatingStatusFor === order.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={\`text-xs font-semibold px-2 py-1 rounded-full border outline-none cursor-pointer appearance-none \${getStatusColor(order.status)}\`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => toggleRow(order.id)}
                          className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        >
                          {expandedRows.has(order.id) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
