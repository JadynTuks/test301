import React from 'react'
import "../styles/AdminUser.css"

const AdminUserPage = () =>
{
    return(
        <div className='admin-user-page-wrapper'>
            <div className="admin-user-page">
                <div className = "left-section">  

                    <input type="text" placeholder="Search..." />

                    <table>
                        <thead>
                            <tr>
                                <th colSpan="2">List Of Users</th>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>John Doe</td>
                                <td>
                                    <select>
                                        <option>Admin</option>
                                        <option>User</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Angelique</td>
                                <td>
                                    <select>
                                        <option>Admin</option>
                                        <option>User</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td>Katlego</td>
                                <td>
                                    <select>
                                        <option>Admin</option>
                                        <option>User</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="divider" /> {/*for the vertical line*/}

                <div className='right-section'>
                    <h2>Your Details:</h2>
                    <p>Name: John</p>
                    <p>Surname: Doe</p>
                    <button type="submit">Update</button>
                    <button type="submit">Logout</button>
                </div>
            </div>
        </div>

    );
};

export default AdminUserPage;